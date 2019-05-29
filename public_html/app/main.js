/*
 * The MIT License
 *
 * Copyright 2019 Maxim Eltratov <Maxim.Eltratov@yandex.ru>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var mapModule = require('./Map');
    var bitmapModule = require('./Bitmap');
    var cameraModule = require('./Camera');
    var gameObjectManagerModule = require('./GameObjectManager');
    var aiManagerModule = require('./AiManager');

    // Load library/vendor modules using
    // full IDs, like:
    //var print = require('print');

    let totalBitmaps = 1;
    let counter = 0;
    let onload = function () {
        counter++;
        if (counter >= totalBitmaps) {
            startGameLoop();
        }
    };

    let background = bitmapModule.createBitmap('./img/sky_daytime_blue.jpg', 2048, 1024, 2048, 1024, onload);
    let walls = bitmapModule.createBitmap('./img/textures.png', 384, 64, 64, 64, onload);
    //let arrowSpriteSheet = bitmapModule.createBitmap('./img/arrowSpriteSheet.png', 64, 256, 64, 64, onload);


    /*function arrowSpriteFactory() {
     let arrowSprite = spriteModule.createSprite('arrow', arrowSpriteSheet);
     arrowSprite.addAnimation(animationModule.createAnimation('move', 3, 1, 2, 4, 1, 1, 1));
     arrowSprite.setCurrentAnimation('move');

     return arrowSprite;
     }

     let arrowSprite = arrowSpriteFactory();*/

    let playerCamera = cameraModule.createCamera(1024, 512);
    playerCamera.setCanvas(document.getElementById("3DView"));

    let mapScreen = cameraModule.createCamera(256, 256);
    mapScreen.setCanvas(document.getElementById("map"));

    let map = mapModule.createMap();

    let gameObjectManager = gameObjectManagerModule.createGameObjectManager();


    gameObjectManager.create('orc', 4, 4, 3);
    gameObjectManager.create('orc', 5, 5, 3);

    let player = gameObjectManager.create('player', 2, 2, 0);
    gameObjectManager.delete(player.id);

    let npcArr = [...gameObjectManager.gameObjects.values()];

    let aiManager = aiManagerModule.createAiManager();

    function startGameLoop() {
        let loop = new GameLoop();
        loop.start(function (seconds) {

            aiManager.update(seconds, player, gameObjectManager, map);

            player.update(seconds);

            gameObjectManager.update(seconds);

            let npcArr = [...gameObjectManager.gameObjects.values()];

            playerCamera.clearScreen();
            playerCamera.drawBackground(background, player.direction);
            playerCamera.drawWalls(player.x, player.y, player.direction, player.fov, map, walls);

            playerCamera.drawObjects(npcArr, player.x, player.y, player.direction, player.fov);


            mapScreen.clearScreen();
            mapScreen.drawMap(map, 'grey');
            mapScreen.drawObjectOnMap(player, map, 'grayish');
            mapScreen.drawFovOnMap(player, map, 'grey');
            mapScreen.drawObjectsOnMap(npcArr, map, 'blue');
            mapScreen.drawFovsOnMap(npcArr, map, 'blue');

        });
    }

    function GameLoop() {
        this.lastTime = 0;
        this.callback = function () {};
        this.frame = this.frame.bind(this);

    }

    GameLoop.prototype.start = function (callback) {
        this.callback = callback;
        requestAnimationFrame(this.frame);
    };

    GameLoop.prototype.frame = function (time) {
        let seconds = (time - this.lastTime) / 1000;
        this.lastTime = time;
        if (seconds < 0.2) {
            this.callback(seconds);
        }
        requestAnimationFrame(this.frame);
    };
});
