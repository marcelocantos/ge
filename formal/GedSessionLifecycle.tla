--------------------------- MODULE GedSessionLifecycle ---------------------------
(* TLA+ specification of the ged daemon's session lifecycle.
 *
 * Models the core state machine from daemon.go: servers register/depart,
 * players connect/disconnect, sessions are created/bridged/migrated, and
 * an active-server pointer determines where new players land.
 *
 * We abstract away WebSocket framing, timeouts, and dashboard state.
 * What remains is the concurrent interleaving of connection events and
 * the invariants the daemon must maintain.
 *)
EXTENDS Naturals, FiniteSets, Sequences, TLC

CONSTANTS
    MaxServers,     \* Upper bound on server IDs to explore
    MaxPlayers      \* Upper bound on player/session IDs to explore

(* -------------------------------------------------------------------------- *)
(* State variables — mirrors the Daemon struct in daemon.go                   *)
(* -------------------------------------------------------------------------- *)
VARIABLES
    servers,        \* Set of registered server IDs
    activeServer,   \* The active server ID, or Nil
    sessions,       \* Function: sessionID -> [playerPresent, serverID,
                    \*                         hasWire, bridged, hasDeviceInfo]
    nextSrvID,      \* Next server ID counter
    nextSessID,     \* Next session ID counter
    \* Observable effects (for liveness / ordering checks)
    sideband,       \* Sequence of sideband messages: [type, sessionID, serverID]
    playerMsgs      \* Sequence of messages to players: [type, sessionID]

Nil == 0  \* Sentinel for "no server"

vars == <<servers, activeServer, sessions, nextSrvID, nextSessID,
          sideband, playerMsgs>>

(* -------------------------------------------------------------------------- *)
(* Type invariant                                                             *)
(* -------------------------------------------------------------------------- *)
SessionRec == [playerPresent : BOOLEAN,
               serverID      : Nat,
               hasWire       : BOOLEAN,
               bridged       : BOOLEAN,
               hasDeviceInfo : BOOLEAN]

TypeOK ==
    /\ servers \subseteq (1..MaxServers)
    /\ activeServer \in {Nil} \union servers
    /\ DOMAIN sessions \subseteq (1..MaxPlayers)
    /\ \A sid \in DOMAIN sessions : sessions[sid] \in SessionRec
    /\ nextSrvID  \in 1..(MaxServers + 1)
    /\ nextSessID \in 1..(MaxPlayers + 1)

(* -------------------------------------------------------------------------- *)
(* Helpers                                                                    *)
(* -------------------------------------------------------------------------- *)
SessionsOnServer(srvID) == {sid \in DOMAIN sessions : sessions[sid].serverID = srvID}

PickAny(S) ==
    \* Non-deterministically choose one element from a non-empty set.
    \* In TLC this is handled by the existential in the action.
    CHOOSE x \in S : TRUE

(* -------------------------------------------------------------------------- *)
(* Initial state                                                              *)
(* -------------------------------------------------------------------------- *)
Init ==
    /\ servers      = {}
    /\ activeServer = Nil
    /\ sessions     = <<>>  \* empty function (no sessions)
    /\ nextSrvID    = 1
    /\ nextSessID   = 1
    /\ sideband     = <<>>
    /\ playerMsgs   = <<>>

(* -------------------------------------------------------------------------- *)
(* AddServer — a new game server connects its sideband                        *)
(*                                                                            *)
(* daemon.go:120 — AddServer                                                  *)
(* If no active server, becomes active and adopts all orphaned sessions.      *)
(* -------------------------------------------------------------------------- *)
AddServer ==
    /\ nextSrvID <= MaxServers
    /\ LET srvID == nextSrvID IN
        /\ servers'      = servers \union {srvID}
        /\ nextSrvID'    = nextSrvID + 1
        /\ IF activeServer = Nil
           THEN
                \* Become active, adopt all existing sessions
                /\ activeServer' = srvID
                /\ sessions' = [sid \in DOMAIN sessions |->
                    [sessions[sid] EXCEPT !.serverID = srvID]]
                /\ sideband' = sideband \o
                    [i \in 1..Cardinality(DOMAIN sessions) |->
                        \* Approximate: notify for each existing session
                        [type |-> "player_attached",
                         sessionID |-> CHOOSE s \in DOMAIN sessions :
                            \A s2 \in DOMAIN sessions :
                                (s2 # s) => s2 >= s,  \* placeholder ordering
                         serverID |-> srvID]]
                    \* Simplification: send player_attached for all existing sessions
                    \* In the real code this iterates d.sessions
           ELSE
                /\ activeServer' = activeServer
                /\ sessions'     = sessions
                /\ sideband'     = sideband
        /\ nextSessID'   = nextSessID
        /\ playerMsgs'   = playerMsgs

(* -------------------------------------------------------------------------- *)
(* RemoveServer — a game server's sideband disconnects                        *)
(*                                                                            *)
(* daemon.go:156 — RemoveServer                                               *)
(* Close wires for affected sessions, send SessionEnd to players,             *)
(* pick new active server, re-assign sessions.                                *)
(* -------------------------------------------------------------------------- *)
RemoveServer(srvID) ==
    /\ srvID \in servers
    /\ LET affected == SessionsOnServer(srvID)
           remaining == servers \ {srvID}
           \* Pick an arbitrary replacement (or Nil)
           newActive == IF remaining = {} THEN Nil
                        ELSE CHOOSE s \in remaining : TRUE
       IN
        \* Close wires and un-bridge affected sessions
        /\ sessions' = [sid \in DOMAIN sessions |->
            IF sid \in affected
            THEN [sessions[sid] EXCEPT
                    !.hasWire = FALSE,
                    !.bridged = FALSE,
                    !.serverID = IF activeServer = srvID
                                 THEN (IF newActive = Nil THEN Nil ELSE newActive)
                                 ELSE sessions[sid].serverID]
            ELSE sessions[sid]]
        \* Send SessionEnd to each affected player
        /\ playerMsgs' = playerMsgs \o
            [i \in 1..Cardinality(affected) |->
                [type |-> "SessionEnd",
                 sessionID |-> CHOOSE s \in affected : TRUE]]
        \* Re-assign if this was the active server
        /\ activeServer' = IF activeServer = srvID THEN newActive ELSE activeServer
        /\ servers'      = remaining
        /\ IF activeServer = srvID /\ newActive # Nil
           THEN sideband' = sideband \o
                [i \in 1..Cardinality(affected) |->
                    [type |-> "player_attached",
                     sessionID |-> CHOOSE s \in affected : TRUE,
                     serverID  |-> newActive]]
           ELSE sideband' = sideband
        /\ UNCHANGED <<nextSrvID, nextSessID>>

(* -------------------------------------------------------------------------- *)
(* AddPlayer — a player connects and sends DeviceInfo                         *)
(*                                                                            *)
(* player.go:11 + daemon.go:308 — handlePlayer + AddPlayer                    *)
(* Creates a session assigned to the active server. Notifies the server.      *)
(* -------------------------------------------------------------------------- *)
AddPlayer ==
    /\ nextSessID <= MaxPlayers
    /\ LET sessID == nextSessID IN
        /\ sessions' = sessions @@ (sessID :> [
                playerPresent |-> TRUE,
                serverID      |-> activeServer,
                hasWire       |-> FALSE,
                bridged       |-> FALSE,
                hasDeviceInfo |-> TRUE  \* DeviceInfo is stored on connect
            ])
        /\ nextSessID' = nextSessID + 1
        /\ IF activeServer # Nil
           THEN sideband' = Append(sideband,
                    [type |-> "player_attached",
                     sessionID |-> sessID,
                     serverID  |-> activeServer])
           ELSE sideband' = sideband
        /\ UNCHANGED <<servers, activeServer, nextSrvID, playerMsgs>>

(* -------------------------------------------------------------------------- *)
(* RemovePlayer — a player disconnects                                        *)
(*                                                                            *)
(* daemon.go:335 — RemovePlayer                                               *)
(* Closes the server wire, removes the session, notifies the server.          *)
(* -------------------------------------------------------------------------- *)
RemovePlayer(sessID) ==
    /\ sessID \in DOMAIN sessions
    /\ sessions[sessID].playerPresent = TRUE
    /\ LET sess == sessions[sessID]
           \* Remove session from the map
           newSessions == [s \in (DOMAIN sessions) \ {sessID} |-> sessions[s]]
       IN
        /\ sessions' = newSessions
        /\ IF sess.serverID # Nil
           THEN sideband' = Append(sideband,
                    [type |-> "player_detached",
                     sessionID |-> sessID,
                     serverID  |-> sess.serverID])
           ELSE sideband' = sideband
        /\ UNCHANGED <<servers, activeServer, nextSrvID, nextSessID, playerMsgs>>

(* -------------------------------------------------------------------------- *)
(* SetSessionWire — server connects a per-session wire, triggers bridge       *)
(*                                                                            *)
(* daemon.go:362 — SetSessionWire + tryBridgeSessionLocked                    *)
(* -------------------------------------------------------------------------- *)
SetSessionWire(sessID) ==
    /\ sessID \in DOMAIN sessions
    /\ sessions[sessID].playerPresent = TRUE
    /\ sessions[sessID].hasWire = FALSE
    /\ sessions[sessID].serverID # Nil
    /\ sessions[sessID].serverID \in servers  \* Server must still be connected
    /\ LET sess     == sessions[sessID]
           canBridge == sess.hasDeviceInfo /\ ~sess.bridged
       IN
        /\ sessions' = [sessions EXCEPT
            ![sessID].hasWire = TRUE,
            ![sessID].bridged = IF canBridge THEN TRUE ELSE sess.bridged]
        /\ UNCHANGED <<servers, activeServer, nextSrvID, nextSessID,
                        sideband, playerMsgs>>

(* -------------------------------------------------------------------------- *)
(* UnsetSessionWire — server wire disconnects for a session                   *)
(*                                                                            *)
(* daemon.go:377 — UnsetSessionWire                                           *)
(* -------------------------------------------------------------------------- *)
UnsetSessionWire(sessID) ==
    /\ sessID \in DOMAIN sessions
    /\ sessions[sessID].hasWire = TRUE
    /\ sessions' = [sessions EXCEPT
        ![sessID].hasWire = FALSE,
        ![sessID].bridged = FALSE]
    /\ UNCHANGED <<servers, activeServer, nextSrvID, nextSessID,
                    sideband, playerMsgs>>

(* -------------------------------------------------------------------------- *)
(* SwitchServer — dashboard switches the active server (all sessions migrate) *)
(*                                                                            *)
(* daemon.go:210 — SwitchServer                                               *)
(* -------------------------------------------------------------------------- *)
SwitchServer(newSrvID) ==
    /\ newSrvID \in servers
    /\ newSrvID # activeServer
    /\ LET migrating == {sid \in DOMAIN sessions :
                            sessions[sid].serverID # newSrvID}
       IN
        /\ activeServer' = newSrvID
        /\ sessions' = [sid \in DOMAIN sessions |->
            IF sid \in migrating
            THEN [sessions[sid] EXCEPT
                    !.hasWire  = FALSE,
                    !.bridged  = FALSE,
                    !.serverID = newSrvID]
            ELSE sessions[sid]]
        \* SessionEnd to each migrated player
        /\ playerMsgs' = playerMsgs \o
            [i \in 1..Cardinality(migrating) |->
                [type |-> "SessionEnd",
                 sessionID |-> CHOOSE s \in migrating : TRUE]]
        \* player_detached to old server, player_attached to new
        /\ sideband' = sideband \o
            [i \in 1..Cardinality(migrating) |->
                [type |-> "player_attached",
                 sessionID |-> CHOOSE s \in migrating : TRUE,
                 serverID  |-> newSrvID]]
        /\ UNCHANGED <<servers, nextSrvID, nextSessID>>

(* -------------------------------------------------------------------------- *)
(* SwitchSession — dashboard moves one session to a different server          *)
(*                                                                            *)
(* daemon.go:262 — SwitchSession                                              *)
(* -------------------------------------------------------------------------- *)
SwitchSession(sessID, newSrvID) ==
    /\ sessID \in DOMAIN sessions
    /\ newSrvID \in servers
    /\ sessions[sessID].serverID # newSrvID
    /\ LET sess == sessions[sessID] IN
        /\ sessions' = [sessions EXCEPT
            ![sessID].hasWire  = FALSE,
            ![sessID].bridged  = FALSE,
            ![sessID].serverID = newSrvID]
        /\ playerMsgs' = Append(playerMsgs,
            [type |-> "SessionEnd", sessionID |-> sessID])
        /\ sideband' = sideband \o <<
            [type |-> "player_detached",
             sessionID |-> sessID,
             serverID  |-> sess.serverID],
            [type |-> "player_attached",
             sessionID |-> sessID,
             serverID  |-> newSrvID]>>
        /\ activeServer' = activeServer  \* Does NOT change active
        /\ UNCHANGED <<servers, nextSrvID, nextSessID>>

(* -------------------------------------------------------------------------- *)
(* Next-state relation                                                        *)
(* -------------------------------------------------------------------------- *)
Next ==
    \/ AddServer
    \/ \E srvID \in servers : RemoveServer(srvID)
    \/ AddPlayer
    \/ \E sid \in DOMAIN sessions : RemovePlayer(sid)
    \/ \E sid \in DOMAIN sessions : SetSessionWire(sid)
    \/ \E sid \in DOMAIN sessions : UnsetSessionWire(sid)
    \/ \E srvID \in servers : SwitchServer(srvID)
    \/ \E sid \in DOMAIN sessions, srvID \in servers : SwitchSession(sid, srvID)

Spec == Init /\ [][Next]_vars

(* ========================================================================== *)
(* INVARIANTS                                                                 *)
(* ========================================================================== *)

(* I1: Active server is either Nil or a member of servers *)
ActiveServerValid ==
    activeServer = Nil \/ activeServer \in servers

(* I2: Every session's serverID references a live server or is Nil *)
SessionServerValid ==
    \A sid \in DOMAIN sessions :
        LET srvID == sessions[sid].serverID IN
        srvID = Nil \/ srvID \in servers

(* I3: Bridge requires both wire and DeviceInfo *)
BridgeSafety ==
    \A sid \in DOMAIN sessions :
        sessions[sid].bridged =>
            /\ sessions[sid].hasWire
            /\ sessions[sid].hasDeviceInfo
            /\ sessions[sid].playerPresent

(* I4: If there are servers, there is an active server *)
ActiveServerExists ==
    servers # {} => activeServer # Nil

(* I5: A bridged session's server must still be alive *)
BridgedServerAlive ==
    \A sid \in DOMAIN sessions :
        sessions[sid].bridged => sessions[sid].serverID \in servers

(* I6: Wire can only exist if the session has a server *)
WireRequiresServer ==
    \A sid \in DOMAIN sessions :
        sessions[sid].hasWire => sessions[sid].serverID \in servers

(* Combined safety invariant *)
Safety == TypeOK /\ ActiveServerValid /\ SessionServerValid
          /\ BridgeSafety /\ ActiveServerExists
          /\ BridgedServerAlive /\ WireRequiresServer

=============================================================================
