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

define(function () {
    function StateContainer() {
        this.state = new StopState(this);

        this.setState = function (state) {
            this.state = state;
        };

        this.getCurrentState = function () {
            return this.state;
        };

        this.getStopState = function () {
            return new StopState(this);
        };

        this.getMoveState = function () {
            return new MoveState(this);
        };

        this.getShootState = function () {
            return new ShootState(this);
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

    State.prototype.stop = function (object) {
        this.container.setState(this.container.getStopState());

        object.getGraphics().setCurrentAnimation('stop');
    };

    State.prototype.move = function (object, seconds) {
        this.container.setState(this.container.getMoveState());

        object.getGraphics().setCurrentAnimation('move');
    };

    State.prototype.shoot = function (object, seconds) {
        this.container.setState(this.container.getShootState());

        object.getGraphics().setCurrentAnimation('shoot');
    };

    function StopState(container) {
        State.apply(this, arguments);
        this.container = container;
        this.name = 'STATE_STOP';

        this.stop = function () {

        };

        this.update = function (object, seconds) {
            object.getGraphics().update(object, seconds);
        };
    }

    StopState.prototype = Object.create(State.prototype);
    StopState.prototype.constructor = StopState;

    function MoveState(container) {
        State.apply(this, arguments);
        this.container = container;
        this.name = 'STATE_MOVE';

        this.move = function (object, seconds) {
            object.getPhysics().move(object, seconds);
        };

        this.update = function (object, seconds) {
            object.getGraphics().update(object, seconds);
        };
    }

    MoveState.prototype = Object.create(State.prototype);
    MoveState.prototype.constructor = MoveState;

    function ShootState(container) {
        State.apply(this, arguments);
        this.container = container;
        this.name = 'STATE_SHOOT';
        this.isChargeTimeElapsed;

        this.shoot = function (object, seconds) {
            if (this.isChargeTimeElapsed) {

                //shoot
                this.isChargeTimeElapsed = false;
                if (object.getGraphics().getCurrentAnimation().name !== 'continueShooting')
                    object.getGraphics().setCurrentAnimation('continueShooting');

            }
        };

        this.move = function (object, seconds) {
            let commands = object.getInputs().handleInput();
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].name === 'Shoot')
                    return;
            }
            this.stop(object);
        };

        this.update = function (object, seconds) {
            object.getGraphics().update(object, seconds);
            this.isChargeTimeElapsed = object.getGraphics().isLastFrame();
        };
    }

    ShootState.prototype = Object.create(State.prototype);
    ShootState.prototype.constructor = ShootState;

    return {
        createStateContainer: function () {
            return new StateContainer();
        },
        StateContainer: StateContainer
    };
});
