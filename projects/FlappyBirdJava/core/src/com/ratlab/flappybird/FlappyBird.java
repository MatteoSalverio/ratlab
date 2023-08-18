package com.ratlab.flappybird;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.BitmapFont;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.Rectangle;
import com.badlogic.gdx.utils.Array;
import com.badlogic.gdx.utils.ScreenUtils;

import java.util.Iterator;
import java.util.Random;

public class FlappyBird extends ApplicationAdapter {
    SpriteBatch batch;
    BitmapFont font;
    Texture birdTexture;
    Texture pipeTexture;
    GameObject bird;
    Array<Rectangle> pipes;
    Array<Boolean> pipePoint;
    Random random = new Random();
    int pipeSpacing = 200;
    int score = 0;

    @Override
    public void create() {
        batch = new SpriteBatch();
        font = new BitmapFont();
        font.setColor(Color.WHITE);
        birdTexture = new Texture(Gdx.files.internal("bird.png"));
        pipeTexture = new Texture(Gdx.files.internal("pipe.png"));
        bird = new GameObject(60, (int) (GameVariables.screenHeight * 0.8f), 68, 48, true);
        pipes = new Array<Rectangle>();
        pipePoint = new Array<Boolean>();

        createPipe(GameVariables.screenWidth);
        createPipe((int) (GameVariables.screenWidth * 1.5f));
    }

    public void createPipe(int x) {
        int y = -(GameVariables.screenHeight) - random.nextInt(200);
        pipes.add(new Rectangle(x, y + 1024 + pipeSpacing, 64, 1024));
        pipes.add(new Rectangle(x - 1, y, 64, 1024));
        pipePoint.add(false);
        pipePoint.add(false);
    }

    public void flap() {
        bird.velocityY += 800;
    }

    public void die() {
        bird.y = GameVariables.screenHeight / 2f;
        bird.velocityY = 0;
        bird.velocityX = 0;
        bird.rotation = 0f;
        pipes.clear();
        score = 0;
        createPipe(GameVariables.screenWidth);
        createPipe((int) (GameVariables.screenWidth * 1.5f));
    }

    public void addPoint() {
        score++;
        System.out.println(score);
    }

    @Override
    public void render() {
        ScreenUtils.clear(0.4f, 0.894f, 1, 1);

        batch.begin();
        for (int i = 0; i < pipes.size; i++) {
            Rectangle pipe = pipes.get(i);
            if (i % 2 != 0)
                batch.draw(pipeTexture, pipe.x, pipe.y, pipe.width, pipe.height);
            else
                batch.draw(pipeTexture, pipe.x, pipe.y, pipe.width, pipe.height, 0, 0, pipeTexture.getWidth(), pipeTexture.getHeight(), false, true);
            pipe.x -= 300 * Gdx.graphics.getDeltaTime();
            if (pipe.x + pipe.width < 0) {
                if (i % 2 != 0) {
                    pipe.x = GameVariables.screenWidth;
                    pipes.get(i - 1).x = GameVariables.screenWidth;
                    pipe.y = -(GameVariables.screenHeight) - random.nextInt(200);
                    pipes.get(i - 1).y = pipe.y + 1024 + pipeSpacing;
                    pipePoint.set(i, false);
                }
            }
        }
        batch.draw(birdTexture, bird.x, bird.y, bird.width / 2f, bird.height / 2f, bird.width, bird.height, 1f, 1f, bird.rotation, 0, 0, birdTexture.getWidth(), birdTexture.getHeight(), false, false);
        font.getData().setScale(2, 2);
        font.draw(batch, score + "", GameVariables.screenWidth / 2f - 20, GameVariables.screenHeight - 50);
        batch.end();

        bird.update();

        if (Gdx.input.isKeyJustPressed(Input.Keys.SPACE) || Gdx.input.isKeyJustPressed(Input.Keys.W)) {
            flap();
            bird.rotation = 30f;
        }
        if (bird.rotation >= -90f)
            bird.rotation -= 0.75f;

        if (bird.y < 0 || bird.y > GameVariables.screenHeight)
            die();

        for (int i = 0; i < pipes.size; i++) {
            Rectangle pipe = pipes.get(i);
            if (bird.x + bird.width >= pipe.x && bird.x < pipe.x + pipe.width) {
                if (bird.y + bird.height > pipe.y && bird.y < pipe.y + pipe.height) {
                    die();
                }
            }
            if (bird.x > pipe.x + (pipe.width / 2)) {
                if (!pipePoint.get(i) && i % 2 != 0) {
                    addPoint();
                    pipePoint.set(i, true);
                }
            }
        }

        if (Gdx.input.isKeyPressed(Input.Keys.ESCAPE))
            Gdx.app.exit();
    }

    @Override
    public void dispose() {
        birdTexture.dispose();
        pipeTexture.dispose();
    }
}
