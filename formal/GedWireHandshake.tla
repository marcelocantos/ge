--------------------------- MODULE GedWireHandshake ----------------------------
(* TLA+ specification of the per-session wire handshake and render loop.
 *
 * Models a single session's state machine across three actors:
 *   - Player: connects to ged, sends DeviceInfo, receives SessionInit,
 *             sends SessionReady, then enters render loop
 *   - Ged:    stores DeviceInfo, bridges when server wire connects,
 *             forwards frames, injects SessionEnd on server switch
 *   - Server: receives DeviceInfo via bridge, sends SessionInit,
 *             receives SessionReady, then enters render loop
 *
 * The render loop uses credit-based flow control (double-buffered):
 *   - Server can only send frames when credits > 0
 *   - Player sends FrameReady after processing FrameEnd, restoring one credit
 *
 * We also model the reconnection path: when the player receives SessionEnd,
 * it tears down and loops back to wait for a new SessionInit.
 *
 * Sources:
 *   ge/src/WireSession.cpp  — server side handshake + render loop
 *   ge/tools/player_core.cpp — player side handshake + render loop
 *   ge/ged/daemon.go        — bridge logic + SessionEnd injection
 *   ge/include/ge/Protocol.h — message types and constants
 *)
EXTENDS Naturals, Sequences, TLC

CONSTANTS
    MaxFrames,          \* Bound on total frames for model checking
    InitialCredits      \* Flow control credits (2 in production)

(* -------------------------------------------------------------------------- *)
(* State variables                                                            *)
(* -------------------------------------------------------------------------- *)
VARIABLES
    \* Player state
    playerState,        \* "disconnected", "connected", "waitSessionInit",
                        \* "waitingReady", "rendering", "teardown"
    playerDeviceInfo,   \* TRUE if player has sent DeviceInfo

    \* Ged bridge state
    gedHasDeviceInfo,   \* TRUE if ged has stored the player's DeviceInfo
    gedServerWire,      \* TRUE if the server's per-session wire is connected
    gedBridged,         \* TRUE if bridge established (DeviceInfo forwarded)

    \* Server state
    serverState,        \* "idle", "waitDeviceInfo", "sentSessionInit",
                        \* "rendering"
    serverHasDeviceInfo,\* TRUE if server received DeviceInfo via bridge

    \* Render loop state
    credits,            \* Flow control credits (server's frame budget)
    framesInFlight,     \* Frames sent by server but not yet ack'd by player
    totalFrames,        \* Total frames sent (for bounding)

    \* Channel: messages in transit (ged sits in the middle)
    toServer,           \* Sequence of messages: player -> ged -> server
    toPlayer,           \* Sequence of messages: server -> ged -> player

    \* Reconnection
    sessionEnded        \* TRUE if ged injected SessionEnd

vars == <<playerState, playerDeviceInfo,
          gedHasDeviceInfo, gedServerWire, gedBridged,
          serverState, serverHasDeviceInfo,
          credits, framesInFlight, totalFrames,
          toServer, toPlayer,
          sessionEnded>>

(* -------------------------------------------------------------------------- *)
(* Message types (matching Protocol.h magic values, abstracted to strings)    *)
(* -------------------------------------------------------------------------- *)
DeviceInfo   == "DeviceInfo"      \* 0x47453244 GE2D
SessionInit  == "SessionInit"     \* 0x47453253 GE2S
SessionReady == "SessionReady"    \* 0x47453259 GE2Y
WireCommand  == "WireCommand"     \* 0x47453243 GE2C
WireResponse == "WireResponse"    \* 0x47453252 GE2R
FrameEnd     == "FrameEnd"        \* 0x47453246 GE2F
FrameReady   == "FrameReady"      \* 0x47453247 GE2G
SessionEnd   == "SessionEnd"      \* 0x4745324D GE2M

(* -------------------------------------------------------------------------- *)
(* Initial state                                                              *)
(* -------------------------------------------------------------------------- *)
Init ==
    /\ playerState       = "disconnected"
    /\ playerDeviceInfo  = FALSE
    /\ gedHasDeviceInfo  = FALSE
    /\ gedServerWire     = FALSE
    /\ gedBridged        = FALSE
    /\ serverState       = "idle"
    /\ serverHasDeviceInfo = FALSE
    /\ credits           = InitialCredits
    /\ framesInFlight    = 0
    /\ totalFrames       = 0
    /\ toServer          = <<>>
    /\ toPlayer          = <<>>
    /\ sessionEnded      = FALSE

(* -------------------------------------------------------------------------- *)
(* PLAYER ACTIONS                                                             *)
(* -------------------------------------------------------------------------- *)

(* Player connects to ged and sends DeviceInfo *)
PlayerConnect ==
    /\ playerState = "disconnected"
    /\ playerState'      = "connected"
    /\ playerDeviceInfo' = TRUE
    /\ gedHasDeviceInfo' = TRUE    \* ged stores DeviceInfo immediately
    /\ UNCHANGED <<gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toServer, toPlayer, sessionEnded>>

(* Player waits for SessionInit after bridge is established *)
PlayerWaitSessionInit ==
    /\ playerState = "connected"
    /\ gedBridged = TRUE           \* Bridge must be up
    /\ playerState' = "waitSessionInit"
    /\ UNCHANGED <<playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toServer, toPlayer, sessionEnded>>

(* Player receives SessionInit from the toPlayer channel *)
PlayerRecvSessionInit ==
    /\ playerState = "waitSessionInit"
    /\ Len(toPlayer) > 0
    /\ Head(toPlayer) = SessionInit
    /\ playerState' = "waitingReady"
    /\ toPlayer'    = Tail(toPlayer)
    /\ UNCHANGED <<playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toServer, sessionEnded>>

(* Player injects wire resources and sends SessionReady *)
PlayerSendReady ==
    /\ playerState = "waitingReady"
    /\ playerState' = "rendering"
    /\ toServer'    = Append(toServer, SessionReady)
    /\ UNCHANGED <<playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toPlayer, sessionEnded>>

(* Player timeout — if the bridge is down and the player is waiting for
 * a response that will never come, it gives up and reconnects.
 * In the real system this is the 5-second SessionInit timeout in
 * player_core.cpp (line 847). Models both waitSessionInit (no
 * SessionInit arrives) and waitingReady (SessionInit was stale,
 * server wire is gone, no SessionReady consumer). *)
PlayerTimeout ==
    /\ playerState \in {"waitSessionInit", "waitingReady"}
    /\ ~gedBridged                 \* Bridge is down — no progress possible
    /\ playerState' = "connected"  \* Loop back
    /\ UNCHANGED <<playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toServer, toPlayer, sessionEnded>>

(* Player processes a FrameEnd and sends FrameReady (credit replenishment) *)
PlayerProcessFrame ==
    /\ playerState = "rendering"
    /\ ~sessionEnded
    /\ Len(toPlayer) > 0
    /\ Head(toPlayer) = FrameEnd
    /\ toPlayer'      = Tail(toPlayer)
    /\ toServer'      = Append(toServer, FrameReady)
    /\ framesInFlight' = framesInFlight - 1
    /\ UNCHANGED <<playerState, playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, totalFrames, sessionEnded>>

(* Player receives SessionEnd — tears down, loops back.
 * Credit/flight state is NOT reset here — that happens when the
 * server wire disconnects (ServerWireDisconnect), because credits
 * are the server's resource. The player just returns to "connected"
 * and waits for a new bridge + SessionInit. *)
PlayerRecvSessionEnd ==
    /\ playerState \in {"waitSessionInit", "rendering"}
    /\ Len(toPlayer) > 0
    /\ Head(toPlayer) = SessionEnd
    /\ playerState'   = "connected"   \* Loop back to wait for new session
    /\ toPlayer'      = Tail(toPlayer)
    /\ sessionEnded'  = FALSE         \* Reset for next session
    /\ UNCHANGED <<playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames, toServer>>

(* -------------------------------------------------------------------------- *)
(* GED ACTIONS                                                                *)
(* -------------------------------------------------------------------------- *)

(* Server connects its per-session wire to ged *)
GedServerWireConnect ==
    /\ ~gedServerWire
    /\ serverState = "idle"
    /\ gedServerWire'     = TRUE
    /\ serverState'       = "waitDeviceInfo"
    \* Try bridge: if we have DeviceInfo, forward it
    /\ IF gedHasDeviceInfo /\ ~gedBridged
       THEN /\ gedBridged'        = TRUE
            /\ serverHasDeviceInfo' = TRUE
       ELSE /\ gedBridged'        = gedBridged
            /\ serverHasDeviceInfo' = serverHasDeviceInfo
    /\ UNCHANGED <<playerState, playerDeviceInfo, gedHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toServer, toPlayer, sessionEnded>>

(* Ged injects SessionEnd (server disconnect or session switch) *)
GedInjectSessionEnd ==
    /\ gedBridged                  \* Only meaningful if bridged
    /\ ~sessionEnded               \* Don't double-send
    /\ sessionEnded' = TRUE
    /\ toPlayer'     = Append(toPlayer, SessionEnd)
    \* Tear down ged-side bridge state
    /\ gedBridged'    = FALSE
    /\ gedServerWire' = FALSE
    /\ UNCHANGED <<playerState, playerDeviceInfo, gedHasDeviceInfo,
                   serverState, serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames, toServer>>

(* -------------------------------------------------------------------------- *)
(* SERVER ACTIONS                                                             *)
(* -------------------------------------------------------------------------- *)

(* Server receives DeviceInfo and sends SessionInit *)
ServerRecvDeviceInfoAndInit ==
    /\ serverState = "waitDeviceInfo"
    /\ serverHasDeviceInfo = TRUE
    /\ serverState' = "sentSessionInit"
    /\ toPlayer'    = Append(toPlayer, SessionInit)
    /\ UNCHANGED <<playerState, playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toServer, sessionEnded>>

(* Server receives SessionReady and begins rendering *)
ServerRecvReady ==
    /\ serverState = "sentSessionInit"
    /\ Len(toServer) > 0
    /\ Head(toServer) = SessionReady
    /\ serverState' = "rendering"
    /\ toServer'    = Tail(toServer)
    /\ UNCHANGED <<playerState, playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverHasDeviceInfo,
                   credits, framesInFlight, totalFrames,
                   toPlayer, sessionEnded>>

(* Server sends a frame (WireCommand + FrameEnd), consuming one credit *)
ServerSendFrame ==
    /\ serverState = "rendering"
    /\ credits > 0
    /\ totalFrames < MaxFrames
    /\ ~sessionEnded
    /\ credits'        = credits - 1
    /\ framesInFlight' = framesInFlight + 1
    /\ totalFrames'    = totalFrames + 1
    /\ toPlayer'       = Append(toPlayer, FrameEnd)  \* Abstract: command + end
    /\ UNCHANGED <<playerState, playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   toServer, sessionEnded>>

(* Server receives FrameReady from player, restoring one credit *)
ServerRecvFrameReady ==
    /\ serverState = "rendering"
    /\ Len(toServer) > 0
    /\ Head(toServer) = FrameReady
    /\ credits' = credits + 1
    /\ toServer' = Tail(toServer)
    /\ UNCHANGED <<playerState, playerDeviceInfo,
                   gedHasDeviceInfo, gedServerWire, gedBridged,
                   serverState, serverHasDeviceInfo,
                   framesInFlight, totalFrames,
                   toPlayer, sessionEnded>>

(* Server wire disconnects (ged closes it, or network failure).
 * The server session thread exits; a new one will start fresh.
 * Credits and in-flight state reset. toServer is flushed (stale
 * FrameReady from old session). toPlayer is NOT flushed — messages
 * already forwarded to the player's WebSocket are in the kernel
 * buffer and will be delivered. *)
ServerWireDisconnect ==
    /\ serverState \in {"waitDeviceInfo", "sentSessionInit", "rendering"}
    /\ serverState'       = "idle"
    /\ serverHasDeviceInfo' = FALSE
    /\ gedServerWire'     = FALSE
    /\ gedBridged'        = FALSE
    /\ credits'           = InitialCredits
    /\ framesInFlight'    = 0
    /\ toServer'          = <<>>
    /\ UNCHANGED <<playerState, playerDeviceInfo, gedHasDeviceInfo,
                   totalFrames, toPlayer, sessionEnded>>

(* -------------------------------------------------------------------------- *)
(* Next-state relation                                                        *)
(* -------------------------------------------------------------------------- *)
Next ==
    \/ PlayerConnect
    \/ PlayerWaitSessionInit
    \/ PlayerRecvSessionInit
    \/ PlayerSendReady
    \/ PlayerTimeout
    \/ PlayerProcessFrame
    \/ PlayerRecvSessionEnd
    \/ GedServerWireConnect
    \/ GedInjectSessionEnd
    \/ ServerRecvDeviceInfoAndInit
    \/ ServerRecvReady
    \/ ServerSendFrame
    \/ ServerRecvFrameReady
    \/ ServerWireDisconnect

Spec == Init /\ [][Next]_vars /\ WF_vars(Next)

(* ========================================================================== *)
(* INVARIANTS                                                                 *)
(* ========================================================================== *)

(* I1: Handshake ordering — SessionInit only after DeviceInfo delivered *)
HandshakeOrder ==
    serverState \in {"sentSessionInit", "rendering"} =>
        serverHasDeviceInfo

(* I2: Credits never negative *)
CreditsSafe ==
    credits >= 0

(* I3: Credits + framesInFlight + in-transit FrameReady = InitialCredits
 *
 * After the player processes a frame it decrements framesInFlight and
 * enqueues FrameReady into toServer. The server hasn't received it yet,
 * so we must count in-transit FrameReady messages to close the books. *)
FrameReadyInTransit ==
    LET Count(seq, msg) == Len(SelectSeq(seq, LAMBDA x : x = msg))
    IN  Count(toServer, FrameReady)

CreditConservation ==
    (serverState = "rendering" /\ playerState = "rendering" /\ ~sessionEnded) =>
        credits + framesInFlight + FrameReadyInTransit = InitialCredits

(* I4: Bridge requires both DeviceInfo stored and server wire present *)
BridgeRequirements ==
    gedBridged => (gedHasDeviceInfo /\ gedServerWire)

(* I5: Server only renders after full handshake *)
ServerRenderingValid ==
    serverState = "rendering" => serverHasDeviceInfo

(* I6: No frames in flight when not rendering *)
NoStaleFrames ==
    (playerState = "disconnected") => framesInFlight = 0

(* I7: toPlayer never contains SessionInit unless server sent it *)
SessionInitSource ==
    \A i \in 1..Len(toPlayer) :
        toPlayer[i] = SessionInit =>
            serverState \in {"sentSessionInit", "rendering"}

(* Combined safety invariant *)
Safety == HandshakeOrder /\ CreditsSafe /\ CreditConservation
          /\ BridgeRequirements /\ ServerRenderingValid

(* ========================================================================== *)
(* LIVENESS (under fairness)                                                  *)
(*                                                                            *)
(* These properties require environmental assumptions (the server wire        *)
(* stays up long enough for the handshake to complete). Without such          *)
(* assumptions, a crash-looping server can starve the player by flooding      *)
(* toPlayer with stale SessionInit messages. The safety invariants above      *)
(* are the primary verification targets; liveness is noted here for           *)
(* documentation but not checked by default.                                  *)
(* ========================================================================== *)

(* L1: If player connects and server wire stays up, eventually render *)
(* Requires: server wire does not disconnect during handshake *)
EventuallyRenders ==
    (playerState = "connected" /\ gedServerWire) ~> (playerState = "rendering")

(* L2: After SessionEnd, player eventually returns to connected state *)
(* Requires: player eventually processes all messages in toPlayer *)
RecoveryAfterSessionEnd ==
    sessionEnded ~> (playerState = "connected")

=============================================================================
