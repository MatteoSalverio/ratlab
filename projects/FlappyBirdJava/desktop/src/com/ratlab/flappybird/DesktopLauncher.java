package com.ratlab.flappybird;

import com.badlogic.gdx.Files;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;
import com.ratlab.flappybird.FlappyBird;

// Please note that on macOS your application needs to be started with the -XstartOnFirstThread JVM argument
public class DesktopLauncher {
	public static void main (String[] arg) {
		Lwjgl3ApplicationConfiguration config = new Lwjgl3ApplicationConfiguration();
		config.useVsync(true);
		config.setForegroundFPS(60);
		config.setTitle("Flappy Bird - Rat Lab");
		config.setWindowedMode(GameVariables.screenWidth, GameVariables.screenHeight);
		config.setWindowIcon(Files.FileType.Internal, "icon_128.png");
		new Lwjgl3Application(new FlappyBird(), config);
	}
}
