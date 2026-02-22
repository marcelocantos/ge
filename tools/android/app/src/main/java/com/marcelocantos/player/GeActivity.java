package com.marcelocantos.player;

import org.libsdl.app.SDLActivity;

public class GeActivity extends SDLActivity {
    @Override
    protected String[] getLibraries() {
        return new String[]{"SDL3", "main"};
    }
}
