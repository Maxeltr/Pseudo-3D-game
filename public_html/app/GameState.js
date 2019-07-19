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
        this.getNullState = function () {
            return new State(this);
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

    State.prototype.start = function (game) {
        game.removeInputHandlers();
        game.loop.start(game.startLoop);
        game.setState(this.container.getStartState());
    };

    State.prototype.play = function (game) {
        game.removeInputHandlers();
        game.loop.start(game.playLoop);
        game.setState(this.container.getPlayState());
        let handler = function (e) {
            if (e.keyCode === 27) {
                game.getState().pause(game);
            }
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
        }.bind(this);
        document.addEventListener('keyup', handler, false);
        game.addInputHandler(handler);
    };

    State.prototype.pause = function (game) {
        game.removeInputHandlers();
        game.loop.start(game.pauseLoop);
        game.setState(this.container.getPauseState());
        let handler = function (e) {
            if (e.keyCode === 27) {
                game.getState().play(game);
            }
            e.preventDefault && e.preventDefault();
            e.stopPropagation && e.stopPropagation();
        }.bind(this);
        document.addEventListener('keyup', handler, false);
        game.addInputHandler(handler);
    };

    State.prototype.loose = function (game) {
        game.removeInputHandlers();
        game.loop.start(game.looseLoop);
        game.setState(this.container.getLooseState());
    };

    State.prototype.win = function (game) {
        game.removeInputHandlers();
        game.loop.start(game.winLoop);
        game.setState(this.container.getWinState());
    };

    function StartState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_START';

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

        this.play = function () {
            return this;
        };
    }

    PlayState.prototype = Object.create(State.prototype);
    PlayState.prototype.constructor = PlayState;

    function PauseState(container) {
        State.apply(this, arguments);
        this.name = 'STATE_PAUSE';

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
