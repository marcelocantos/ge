package main

import "embed"

//go:embed web/dist/*
var embeddedUI embed.FS
