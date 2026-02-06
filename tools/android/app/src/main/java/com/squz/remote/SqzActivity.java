package com.squz.remote;

import org.libsdl.app.SDLActivity;

public class SqzActivity extends SDLActivity {
    @Override
    protected String[] getLibraries() {
        return new String[]{"SDL3", "main"};
    }
}
