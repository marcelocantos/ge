---- MODULE GedSessionLifecycle_TTrace_1772415432 ----
EXTENDS Sequences, TLCExt, Toolbox, Naturals, TLC, GedSessionLifecycle

_expression ==
    LET GedSessionLifecycle_TEExpression == INSTANCE GedSessionLifecycle_TEExpression
    IN GedSessionLifecycle_TEExpression!expression
----

_trace ==
    LET GedSessionLifecycle_TETrace == INSTANCE GedSessionLifecycle_TETrace
    IN GedSessionLifecycle_TETrace!trace
----

_inv ==
    ~(
        TLCGet("level") = Len(_TETrace)
        /\
        sessions = (<<[playerPresent |-> TRUE, serverID |-> 2, hasWire |-> FALSE, bridged |-> FALSE, hasDeviceInfo |-> TRUE]>>)
        /\
        servers = ({1})
        /\
        nextSessID = (2)
        /\
        activeServer = (1)
        /\
        playerMsgs = (<<[type |-> "SessionEnd", sessionID |-> 1], [type |-> "SessionEnd", sessionID |-> 1]>>)
        /\
        sideband = (<<[serverID |-> 1, type |-> "player_attached", sessionID |-> 1], [serverID |-> 1, type |-> "player_detached", sessionID |-> 1], [serverID |-> 2, type |-> "player_attached", sessionID |-> 1]>>)
        /\
        nextSrvID = (3)
    )
----

_init ==
    /\ playerMsgs = _TETrace[1].playerMsgs
    /\ nextSessID = _TETrace[1].nextSessID
    /\ nextSrvID = _TETrace[1].nextSrvID
    /\ sessions = _TETrace[1].sessions
    /\ servers = _TETrace[1].servers
    /\ sideband = _TETrace[1].sideband
    /\ activeServer = _TETrace[1].activeServer
----

_next ==
    /\ \E i,j \in DOMAIN _TETrace:
        /\ \/ /\ j = i + 1
              /\ i = TLCGet("level")
        /\ playerMsgs  = _TETrace[i].playerMsgs
        /\ playerMsgs' = _TETrace[j].playerMsgs
        /\ nextSessID  = _TETrace[i].nextSessID
        /\ nextSessID' = _TETrace[j].nextSessID
        /\ nextSrvID  = _TETrace[i].nextSrvID
        /\ nextSrvID' = _TETrace[j].nextSrvID
        /\ sessions  = _TETrace[i].sessions
        /\ sessions' = _TETrace[j].sessions
        /\ servers  = _TETrace[i].servers
        /\ servers' = _TETrace[j].servers
        /\ sideband  = _TETrace[i].sideband
        /\ sideband' = _TETrace[j].sideband
        /\ activeServer  = _TETrace[i].activeServer
        /\ activeServer' = _TETrace[j].activeServer

\* Uncomment the ASSUME below to write the states of the error trace
\* to the given file in Json format. Note that you can pass any tuple
\* to `JsonSerialize`. For example, a sub-sequence of _TETrace.
    \* ASSUME
    \*     LET J == INSTANCE Json
    \*         IN J!JsonSerialize("GedSessionLifecycle_TTrace_1772415432.json", _TETrace)

=============================================================================

 Note that you can extract this module `GedSessionLifecycle_TEExpression`
  to a dedicated file to reuse `expression` (the module in the 
  dedicated `GedSessionLifecycle_TEExpression.tla` file takes precedence 
  over the module `GedSessionLifecycle_TEExpression` below).

---- MODULE GedSessionLifecycle_TEExpression ----
EXTENDS Sequences, TLCExt, Toolbox, Naturals, TLC, GedSessionLifecycle

expression == 
    [
        \* To hide variables of the `GedSessionLifecycle` spec from the error trace,
        \* remove the variables below.  The trace will be written in the order
        \* of the fields of this record.
        playerMsgs |-> playerMsgs
        ,nextSessID |-> nextSessID
        ,nextSrvID |-> nextSrvID
        ,sessions |-> sessions
        ,servers |-> servers
        ,sideband |-> sideband
        ,activeServer |-> activeServer
        
        \* Put additional constant-, state-, and action-level expressions here:
        \* ,_stateNumber |-> _TEPosition
        \* ,_playerMsgsUnchanged |-> playerMsgs = playerMsgs'
        
        \* Format the `playerMsgs` variable as Json value.
        \* ,_playerMsgsJson |->
        \*     LET J == INSTANCE Json
        \*     IN J!ToJson(playerMsgs)
        
        \* Lastly, you may build expressions over arbitrary sets of states by
        \* leveraging the _TETrace operator.  For example, this is how to
        \* count the number of times a spec variable changed up to the current
        \* state in the trace.
        \* ,_playerMsgsModCount |->
        \*     LET F[s \in DOMAIN _TETrace] ==
        \*         IF s = 1 THEN 0
        \*         ELSE IF _TETrace[s].playerMsgs # _TETrace[s-1].playerMsgs
        \*             THEN 1 + F[s-1] ELSE F[s-1]
        \*     IN F[_TEPosition - 1]
    ]

=============================================================================



Parsing and semantic processing can take forever if the trace below is long.
 In this case, it is advised to uncomment the module below to deserialize the
 trace from a generated binary file.

\*
\*---- MODULE GedSessionLifecycle_TETrace ----
\*EXTENDS IOUtils, TLC, GedSessionLifecycle
\*
\*trace == IODeserialize("GedSessionLifecycle_TTrace_1772415432.bin", TRUE)
\*
\*=============================================================================
\*

---- MODULE GedSessionLifecycle_TETrace ----
EXTENDS TLC, GedSessionLifecycle

trace == 
    <<
    ([sessions |-> <<>>,servers |-> {},nextSessID |-> 1,activeServer |-> 0,playerMsgs |-> <<>>,sideband |-> <<>>,nextSrvID |-> 1]),
    ([sessions |-> <<[playerPresent |-> TRUE, serverID |-> 0, hasWire |-> FALSE, bridged |-> FALSE, hasDeviceInfo |-> TRUE]>>,servers |-> {},nextSessID |-> 2,activeServer |-> 0,playerMsgs |-> <<>>,sideband |-> <<>>,nextSrvID |-> 1]),
    ([sessions |-> <<[playerPresent |-> TRUE, serverID |-> 1, hasWire |-> FALSE, bridged |-> FALSE, hasDeviceInfo |-> TRUE]>>,servers |-> {1},nextSessID |-> 2,activeServer |-> 1,playerMsgs |-> <<>>,sideband |-> <<[serverID |-> 1, type |-> "player_attached", sessionID |-> 1]>>,nextSrvID |-> 2]),
    ([sessions |-> <<[playerPresent |-> TRUE, serverID |-> 1, hasWire |-> FALSE, bridged |-> FALSE, hasDeviceInfo |-> TRUE]>>,servers |-> {1, 2},nextSessID |-> 2,activeServer |-> 1,playerMsgs |-> <<>>,sideband |-> <<[serverID |-> 1, type |-> "player_attached", sessionID |-> 1]>>,nextSrvID |-> 3]),
    ([sessions |-> <<[playerPresent |-> TRUE, serverID |-> 2, hasWire |-> FALSE, bridged |-> FALSE, hasDeviceInfo |-> TRUE]>>,servers |-> {1, 2},nextSessID |-> 2,activeServer |-> 1,playerMsgs |-> <<[type |-> "SessionEnd", sessionID |-> 1]>>,sideband |-> <<[serverID |-> 1, type |-> "player_attached", sessionID |-> 1], [serverID |-> 1, type |-> "player_detached", sessionID |-> 1], [serverID |-> 2, type |-> "player_attached", sessionID |-> 1]>>,nextSrvID |-> 3]),
    ([sessions |-> <<[playerPresent |-> TRUE, serverID |-> 2, hasWire |-> FALSE, bridged |-> FALSE, hasDeviceInfo |-> TRUE]>>,servers |-> {1},nextSessID |-> 2,activeServer |-> 1,playerMsgs |-> <<[type |-> "SessionEnd", sessionID |-> 1], [type |-> "SessionEnd", sessionID |-> 1]>>,sideband |-> <<[serverID |-> 1, type |-> "player_attached", sessionID |-> 1], [serverID |-> 1, type |-> "player_detached", sessionID |-> 1], [serverID |-> 2, type |-> "player_attached", sessionID |-> 1]>>,nextSrvID |-> 3])
    >>
----


=============================================================================

---- CONFIG GedSessionLifecycle_TTrace_1772415432 ----
CONSTANTS
    MaxServers = 2
    MaxPlayers = 3

INVARIANT
    _inv

CHECK_DEADLOCK
    \* CHECK_DEADLOCK off because of PROPERTY or INVARIANT above.
    FALSE

INIT
    _init

NEXT
    _next

CONSTANT
    _TETrace <- _trace

ALIAS
    _expression
=============================================================================
\* Generated on Mon Mar 02 12:37:12 AEDT 2026