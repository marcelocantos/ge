package main

import "embed"

//go:embed web/dist/*
var embeddedUI embed.FS

//go:embed agents-guide.md
var agentGuide string
