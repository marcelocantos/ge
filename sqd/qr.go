package main

import (
	"fmt"
	"os"

	"github.com/skip2/go-qrcode"
)

// printQR prints a QR code to stderr using Unicode half-block characters.
// Each character cell represents two vertical modules.
func printQR(url string) {
	qr, err := qrcode.New(url, qrcode.Medium)
	if err != nil {
		fmt.Fprintf(os.Stderr, "  %s\n", url)
		return
	}
	bmp := qr.Bitmap()
	rows := len(bmp)

	fmt.Fprintln(os.Stderr)

	// Process two rows at a time using Unicode half-block characters.
	// Top half = upper row, bottom half = lower row.
	// ' ' = both white, '\u2588' = both black,
	// '\u2580' = top black / bottom white, '\u2584' = top white / bottom black.
	for y := 0; y < rows; y += 2 {
		fmt.Fprint(os.Stderr, "  ")
		for x := 0; x < len(bmp[y]); x++ {
			top := bmp[y][x]
			bot := false
			if y+1 < rows {
				bot = bmp[y+1][x]
			}
			switch {
			case !top && !bot:
				fmt.Fprint(os.Stderr, " ")
			case top && bot:
				fmt.Fprint(os.Stderr, "\u2588")
			case top && !bot:
				fmt.Fprint(os.Stderr, "\u2580")
			case !top && bot:
				fmt.Fprint(os.Stderr, "\u2584")
			}
		}
		fmt.Fprintln(os.Stderr)
	}

	fmt.Fprintf(os.Stderr, "  %s\n", url)
}
