package com.ratlab.flappybird;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.ScreenUtils;

import com.ratlab.flappybird.GameVariables;
import com.ratlab.flappybird.GameObject;

import java.util.Iterator;

public class FlappyBird extends ApplicationAdapter {
    SpriteBatch batch;
    Texture birdTexture;
    Texture pipeTexture;
    GameObject bird;
    Array<Rectangle> pipes;
    float lastPipeX = 0, lastPipeY = 0;

    @Override
    public void create() {
        batch = new SpriteBatch();
        birdTexture = new Texture(Gdx.files.internal("bird.png"));
        pipeTexture = new Texture(Gdx.files.internal("pipe.png"));
        bird = new GameObject(60, (int)(GameVariables.screenHeight * 0.8f), 68, 48, true);
        pipes = new Array<Rectangle>();

        createPipe(GameVariables.screenWidth);
        createPipe((int) (GameVariables.screenWidth * 1.5f));
    }

    public void createPipe(int x) {
        pipes.add(new Rectangle(x, -(GameVariables.screenHeight + 80), 64, 1024));
        pipes.add(new Rectangle(x, 1024 + 500, 64, 1024));
    }

    public void flap() {
        bird.velocityY += 800;
    }

    public void die() {
        bird.y = GameVariables.screenHeight / 2f;
        bird.velocityY = 0;
        bird.velocityX = 0;
        pipes.clear();
        createPipe(GameVariables.screenWidth);
        createPipe((int) (GameVariables.screenWidth * 1.5f));
    }

    @Override
    public void render() {
        ScreenUtils.clear(0.4f, 0.894f, 1, 1);

        batch.begin();
        for (int i = 0; i < pipes.size; i++) {
            Rectangle pipe = pipes.get(i);
            if (i % 2 == 0)
                batch.draw(pipeTexture, pipe.x, pipe.y, pipe.width, pipe.height);
            else
                batch.draw(pipeTexture, pipe.x, pipe.y, pipe.width, -pipe.height);
            pipe.x -= 300 * Gdx.graphics.getDeltaTime();
            if (pipe.x + pipe.width < 0) {
                pipe.x = GameVariables.screenWidth;
            }
        }
        batch.draw(birdTexture, bird.x, bird.y, bird.width, bird.height);
        batch.end();

        bird.update();

        if (Gdx.input.isKeyJustPressed(Input.Keys.SPACE) || Gdx.input.isKeyJustPressed(Input.Keys.W)) {
            flap();
        }

        if (bird.y < 0 || bird.y > GameVariables.screenHeight)
            die();

        for (int i = 0; i < pipes.size; i++) {
            Rectangle pipe = pipes.get(i);
            if (bird.x + bird.width >= pipe.x && bird.x < pipe.x + pipe.width) {
                if (/*i % 2 == 0 && */bird.y + bird.height > pipe.y && bird.y < pipe.y + pipe.height) {
                    die();
                }
                else if (/*i % 2 != 0 && */bird.y + bird.height > pipe.y + pipe.height + 280 && bird.y < GameVariables.screenHeight) {
                    die();
                }
            }
        }
    }

    @Override
    public void dispose() {
    }
}
