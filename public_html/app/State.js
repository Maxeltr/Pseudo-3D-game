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
        }

        this.getStopState = function () {
            return new StopState(this);
        }

        this.getMoveState = function () {
            return new MoveState(this);
        }

        this.getAttackState = function () {
            return new AttackState(this);
        }
    }

    function State(container) {
        this.container = container;
        this.name;
    }

    State.prototype.getName = function () {
        return this.name;
    };

    State.prototype.update = function () {

    }

    State.prototype.stop = function () {
        this.container.setState(this.container.getStopState());
    };

    State.prototype.move = function (object, distance, map) {
        this.container.setState(this.container.getMoveState());
        object.move(distance, map);
        update graphic?
    };

    State.prototype.attack = function () {
        this.container.setState(this.container.getAttackState());
    }


    function StopState(container) {
        State.apply(this, arguments);
        this.container = container;
        this.name = 'STATE_STOP';

        this.getName = function () {
            return this.name;
        };

        this.stop = function () {

        }

        this.update = function () {

        }
    }

    StopState.prototype = Object.create(State.prototype);
    StopState.prototype.constructor = StopState;

    function MoveState(container) {
        State.apply(this, arguments);
        this.container = container;
        this.name = 'STATE_MOVE';

        this.getName = function () {
            return this.name;
        };

        this.move = function () {

        }

        this.update = function (object, seconds) {
            object.graphicsComponent._frameIndex += object.graphicsComponent.animationSpeed * object.movementVelocity * seconds;
            object.graphicsComponent.frameIndex = Math.trunc(object.graphicsComponent._frameIndex);
            if (object.graphicsComponent.frameIndex > object.graphicsComponent.frames) {
                object.graphicsComponent.frameIndex = object.graphicsComponent._frameIndex = 0;
            }
        }
    }

    MoveState.prototype = Object.create(State.prototype);
    MoveState.prototype.constructor = MoveState;

    function AttackState(container) {
        State.apply(this, arguments);
        this.container = container;
        this.name = 'STATE_ATTACK';

        this.getName = function () {
            return this.name;
        };

        this.attack = function () {

        }

        this.update = function () {

        }
    }

    AttackState.prototype = Object.create(State.prototype);
    AttackState.prototype.constructor = AttackState;

    return {
        StateContainer: StateContainer
    };
});
