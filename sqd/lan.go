package main

import "net"

// lanIP returns the preferred LAN IP address by opening a UDP "connection"
// to a public address (no packets sent) and reading the local address.
func lanIP() string {
	conn, err := net.Dial("udp4", "8.8.8.8:53")
	if err != nil {
		return "127.0.0.1"
	}
	defer conn.Close()
	addr := conn.LocalAddr().(*net.UDPAddr)
	return addr.IP.String()
}
