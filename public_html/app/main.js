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
    var playerModule = require('./Player');
    var gameObjectModule = require('./GameObject');
    var commandModule = require('./Command');
    var playerInputComponentModule = require('./PlayerInputComponent');
    var graphicsComponentModule = require('./GraphicsComponent');
    var physicsComponentModule = require('./PhysicsComponent');
    var stateModule = require('./State');

    var spriteModule = require('./Sprite');
    var animationModule = require('./Animation');




    /*function Monster () {

     this.sizeRadius = 0.3;
     };

     Monster.prototype = Object.create(command.MoveCommand.prototype);
     Monster.prototype.constructor = Monster;

     console.log(new Monster());*/

    // Load library/vendor modules using
    // full IDs, like:
    //var print = require('print');

    let playerInputComponent = playerInputComponentModule.createPlayerInputComponent(
            new commandModule.MoveForwardCommand(),
            new commandModule.MoveBackwardCommand(),
            new commandModule.RotateLeftCommand(),
            new commandModule.RotateRightCommand(),
            new commandModule.ShootCommand()
            );


    let totalBitmaps = 4;
    let counter = 0;
    let onload = function () {
        counter++;
        if (counter >= totalBitmaps) {
            startGameLoop();
        }
    };

    let background = bitmapModule.createBitmap('./img/sky_daytime_blue.jpg', 2048, 1024, 2048, 1024, onload);
    let walls = bitmapModule.createBitmap('./img/textures.png', 384, 64, 64, 64, onload);
    let orcSpriteSheet = bitmapModule.createBitmap('./img/orcSpriteSheet.png', 832, 1344, 64, 64, onload);
    let arrowSpriteSheet = bitmapModule.createBitmap('./img/arrowSpriteSheet.png', 64, 256, 64, 64, onload);

    function orcSpriteFactory() {
        let orcSprite = spriteModule.createSprite('orc', orcSpriteSheet);
        orcSprite.addAnimation(animationModule.createAnimation('stop', 10, 8, 9, 11, 1, 1, 1));
        orcSprite.addAnimation(animationModule.createAnimation('move', 10, 8, 9, 11, 9, 1, 1));
        orcSprite.addAnimation(animationModule.createAnimation('shoot', 18, 16, 17, 19, 12, 1, 1));
        orcSprite.addAnimation(animationModule.createAnimation('continueShooting', 18, 16, 17, 19, 12, 1, 5));
        orcSprite.setCurrentAnimation('stop');

        return orcSprite;
    }

    function arrowSpriteFactory() {
        let arrowSprite = spriteModule.createSprite('arrow', arrowSpriteSheet);
        arrowSprite.addAnimation(animationModule.createAnimation('move', 3, 1, 2, 4, 1, 1, 1));
        arrowSprite.setCurrentAnimation('move');

        return arrowSprite;
    }

    let orcSprite = orcSpriteFactory();
    let arrowSprite = arrowSpriteFactory();

    let playerCamera = cameraModule.createCamera(1024, 512);
    playerCamera.setCanvas(document.getElementById("3DView"));

    let mapScreen = cameraModule.createCamera(256, 256);
    mapScreen.setCanvas(document.getElementById("map"));

    let map = mapModule.createMap();

    let stateContainer = new stateModule.StateContainer();
    let stateComponent = stateContainer.getStopState();

    let physicsComponent = physicsComponentModule.createPhysicsComponent(map);
    let graphicsComponent = graphicsComponentModule.createGraphicsComponent(orcSprite);

    let player = gameObjectModule.createGameObject(physicsComponent, graphicsComponent, playerInputComponent, stateComponent);

    let npcArr = [
        gameObjectModule.createGameObject(physicsComponent, graphicsComponent, playerInputComponent, stateComponent),
        gameObjectModule.createGameObject(physicsComponent, graphicsComponent, playerInputComponent, stateComponent),
        gameObjectModule.createGameObject(physicsComponent, graphicsComponent, playerInputComponent, stateComponent),
        gameObjectModule.createGameObject(physicsComponent, graphicsComponent, playerInputComponent, stateComponent)

    ];

    npcArr[0].direction = 0.7;

    npcArr[1].x = 4;
    npcArr[1].y = 4;
    npcArr[1].direction = 3;

    npcArr[2].x = 7;
    npcArr[2].y = 7.7;
    npcArr[2].direction = 5;

    npcArr[3].x = 14.7;
    npcArr[3].y = 10.5;
    npcArr[3].direction = 4.14;

    function startGameLoop() {
        let loop = new GameLoop();
        loop.start(function (seconds) {

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

            for (j = 0; j < npcArr.length; j++) {
                npcArr[j].update(seconds);
            }

            player.update(seconds);

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
