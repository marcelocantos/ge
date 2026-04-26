---- MODULE GeWire ----
\* Auto-generated from protocol YAML. Do not edit.

EXTENDS Integers, Sequences, FiniteSets, TLC

\* States for server
server_Idle == "server_Idle"

\* States for player
player_Idle == "player_Idle"

\* States for ged
ged_Idle == "ged_Idle"

\* Message types
MSG_device_info == "device_info"
MSG_safe_area == "safe_area"
MSG_sdl_event == "sdl_event"
MSG_session_end == "session_end"
MSG_server_assigned == "server_assigned"
MSG_session_config == "session_config"
MSG_sqlpipe_msg == "sqlpipe_msg"
MSG_video_stream == "video_stream"
MSG_stream_start == "stream_start"
MSG_stream_stop == "stream_stop"
MSG_aspect_lock == "aspect_lock"

\* Event types
EVT_connected == "connected"



CONSTANTS server_state, player_state, ged_state

VARIABLES

vars == <<>>

Init ==
    /\ server_state = server_Idle
    /\ player_state = player_Idle
    /\ ged_state = ged_Idle

\* server: Idle -> Idle (connected)
server_Idle_to_Idle_connected ==
    /\ server_state = server_Idle
    /\ server_state' = server_Idle


\* player: Idle -> Idle (connected)
player_Idle_to_Idle_connected ==
    /\ player_state = player_Idle
    /\ player_state' = player_Idle


\* ged: Idle -> Idle (connected)
ged_Idle_to_Idle_connected ==
    /\ ged_state = ged_Idle
    /\ ged_state' = ged_Idle


Next ==
    \/ server_Idle_to_Idle_connected
    \/ player_Idle_to_Idle_connected
    \/ ged_Idle_to_Idle_connected

Spec == Init /\ [][Next]_vars /\ WF_vars(Next)

\* ================================================================
\* Invariants and properties
\* ================================================================


====
