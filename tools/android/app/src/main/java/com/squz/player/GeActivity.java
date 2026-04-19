package com.squz.player;

import android.content.Intent;
import android.os.Bundle;
import org.libsdl.app.SDLActivity;

public class GeActivity extends SDLActivity {
    // Holds the ged_addr intent extra so native code can retrieve it via JNI.
    // Set before SDL's native thread starts; cleared after first read.
    private static volatile String sGedAddr = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Check for ged_addr intent extra before super.onCreate() loads the
        // native libraries and starts the SDL thread — this ensures it is
        // available when SDL_main runs.
        Intent intent = getIntent();
        if (intent != null) {
            String addr = intent.getStringExtra("ged_addr");
            if (addr != null && !addr.isEmpty()) {
                sGedAddr = addr;
            }
        }
        super.onCreate(savedInstanceState);
    }

    // Called from native (JNI) to retrieve the intent-supplied ged address.
    // Returns the address string (e.g. "192.168.1.100:42069") or null if absent.
    // Clears the value after the first read so it does not persist across
    // Activity restarts within the same process.
    public static String getGedAddr() {
        String addr = sGedAddr;
        sGedAddr = null;
        return addr;
    }

    @Override
    protected String[] getLibraries() {
        return new String[]{"SDL3", "main"};
    }
}
