package com.ratlab.flappybird;

import com.badlogic.gdx.Gdx;

public class GameObject {
    public float x;
    public float y;
    public int width;
    public int height;
    public boolean movable;
    public float rotation = 0f;
    public float velocityX, velocityY;
    public GameObject(int x, int y, int width, int height, boolean movable) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.movable = movable;
    }

    public void update() {
        this.physicsUpdate();
    }

    public void physicsUpdate() {
        if(this.movable) {
            velocityY += GameVariables.gravity * Gdx.graphics.getDeltaTime();
        }

        this.y += velocityY * Gdx.graphics.getDeltaTime();
    }
}
