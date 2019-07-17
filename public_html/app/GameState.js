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
    function StateContainer() {
        var mapModule = require('./Map');
        var bitmapModule = require('./Bitmap');
        var cameraModule = require('./Camera');
        var gameObjectManagerModule = require('./GameObjectManager');
        var aiManagerModule = require('./AiManager');
        var collisionDetectorModule = require('./CollisionDetector');
        var gameLoopModule = require('./GameLoop');

        let background = bitmapModule.create('./img/sky_daytime_blue.jpg', 2048, 1024, 2048, 1024);
        let walls = bitmapModule.create('./img/textures.png', 384, 64, 64, 64);

        let playerCamera = cameraModule.create(512, 256);
        playerCamera.setCanvas(document.getElementById("3DView"));

        let mapScreen = cameraModule.create(256, 256);
        mapScreen.setCanvas(document.getElementById("map"));

        let map = mapModule.create();

        let gameObjectManager = gameObjectManagerModule.create();

        gameObjectManager.create('orc', 4, 4, 0);
        gameObjectManager.create('orc', 7, 2, 0.8);
        gameObjectManager.create('orc', 4, 2, 0.8);
        gameObjectManager.create('orc', 7, 6, 0.8);
        gameObjectManager.create('orc', 9, 2, 0.8);
        gameObjectManager.create('orc', 7, 8, 0.8);
        gameObjectManager.create('orc', 3, 5, 0);

        let player = gameObjectManager.create('player', 7, 2.7, 3.14);

        let aiManager = aiManagerModule.create(player, gameObjectManager, map);

        let collisionDetector = collisionDetectorModule.create(gameObjectManager, map);

        this.loop = gameLoopModule.create();

        this.startLoop = function (seconds) {
            playerCamera.context.fillStyle = "red";
            playerCamera.context.font = "24px serif";
            playerCamera.context.fillText('start', 15, 20);
        };

        this.playLoop = function (seconds) {
            aiManager.update(seconds);
            gameObjectManager.update(seconds);
            collisionDetector.update(seconds);

            let npcArr = gameObjectManager.getArrayObjects();

            playerCamera.clearScreen();
            playerCamera.drawBackground(background, player.direction);
            playerCamera.drawWalls(player.x, player.y, player.direction, player.fov, map, walls);
            playerCamera.drawObjects(npcArr, player.x + 0.1 * Math.cos(player.direction), player.y + 0.1 * Math.sin(player.direction), player.direction, player.fov);


            mapScreen.clearScreen();
            mapScreen.drawMap(map, 'grey');
            mapScreen.drawObjectsOnMap(npcArr, map, 'blue');
            mapScreen.drawFovsOnMap(npcArr, map, 'blue');
            mapScreen.drawObjectOnMap(player, map, 'grayish');
            mapScreen.drawFovOnMap(player, map, 'grey');

        };

        this.pauseLoop = function (seconds) {
            let npcArr = gameObjectManager.getArrayObjects();

            playerCamera.clearScreen();
            playerCamera.drawBackground(background, player.direction);
            playerCamera.drawWalls(player.x, player.y, player.direction, player.fov, map, walls);
            playerCamera.drawObjects(npcArr, player.x + 0.1 * Math.cos(player.direction), player.y + 0.1 * Math.sin(player.direction), player.direction, player.fov);


            mapScreen.clearScreen();
            mapScreen.drawMap(map, 'grey');
            mapScreen.drawObjectsOnMap(npcArr, map, 'blue');
            mapScreen.drawFovsOnMap(npcArr, map, 'blue');
            mapScreen.drawObjectOnMap(player, map, 'grayish');
            mapScreen.drawFovOnMap(player, map, 'grey');

        };

        this.looseLoop = function (seconds) {
            playerCamera.context.fillStyle = "red";
            playerCamera.context.font = "24px serif";
            playerCamera.context.fillText('loose', 15, 20);
        };

        this.winLoop = function (seconds) {
            playerCamera.context.fillStyle = "red";
            playerCamera.context.font = "24px serif";
            playerCamera.context.fillText('win', 15, 20);
        };

        this.getStartState = function () {
            return new StartState(this);
        };

        this.getPlayState = function () {
            return new PlayState(this);
        };

        this.getPauseState = function () {
            return new PauseState(this);
        };

        this.getLooseState = function () {
            return new LooseState(this);
        };

        this.getWinState = function () {
            return new WinState(this);
        };
    }

    function State(container) {
        this.container = container;
        this.name;
    }

    State.prototype.getName = function () {
        return this.name;
    };

    State.prototype.update = function () {

    };

    State.prototype.start = function () {
        return this.container.getStartState();
    };

    State.prototype.play = function () {
        return this.container.getPlayState();
    };

    State.prototype.pause = function () {
        return this.container.getPauseState();
    };

    State.prototype.loose = function () {
        return this.container.getLooseState();
    };

    State.prototype.win = function () {
        return this.container.getWinState();
    };

    function StartState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_START';

        this.container.loop.start(this.container.startLoop);

        this.start = function () {
            return this;
        };

        this.pause = function () {
            return this;
        };

        this.loose = function () {
            return this;
        };

        this.win = function () {
            return this;
        };
    }

    StartState.prototype = Object.create(State.prototype);
    StartState.prototype.constructor = StartState;

    function PlayState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_PLAY';

        document.addEventListener('keyup', OnKey.bind(this), false);    //how to remove listener?
        function OnKey(e) {
            if (e.keyCode === 27) {
                this.pause();
            }
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
        }
        ;

        this.container.loop.start(this.container.playLoop);

        this.play = function () {
            return this;
        };
    }

    PlayState.prototype = Object.create(State.prototype);
    PlayState.prototype.constructor = PlayState;

    function PauseState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_PAUSE';

        this.container.loop.start(this.container.pauseLoop);

        this.pause = function () {
            return this;
        };

        this.loose = function () {
            return this;
        };

        this.win = function () {
            return this;
        };
    }

    PauseState.prototype = Object.create(State.prototype);
    PauseState.prototype.constructor = PauseState;

    function LooseState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_LOOSE';

        this.container.loop.start(this.container.looseLoop);

        this.loose = function () {

        };

        this.play = function () {
            return this;
        };

        this.pause = function () {
            return this;
        };

        this.win = function () {
            return this;
        };
    }

    LooseState.prototype = Object.create(State.prototype);
    LooseState.prototype.constructor = LooseState;

    function WinState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_WIN';

        this.container.loop.start(this.container.winLoop);

        this.win = function () {
            return this;
        };

        this.play = function () {
            return this;
        };

        this.pause = function () {
            return this;
        };

        this.loose = function () {
            return this;
        };
    }

    WinState.prototype = Object.create(State.prototype);
    WinState.prototype.constructor = WinState;

    return {
        createStateContainer: function () {
            return new StateContainer();
        },
        StateContainer: StateContainer
    };
});
