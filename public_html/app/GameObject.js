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
    function GameObject(physicsComponent, graphicsComponent, inputComponent, stateComponent) {
        this.name;
        this.x = 1.4;
        this.y = 1.4;
        this.direction = 0.0;
        this.fov = Math.PI / 3.0;               //field of view
        this.sizeRadius = 0.3;
        this.removed = false;
        this.movementVelocity = 3;
        this.rotationVelocity = Math.PI;
        this.physicsComponent = physicsComponent;
        this.graphicsComponent = graphicsComponent;
        this.inputComponent = inputComponent;
        this.stateComponent = stateComponent;
        this.paces = 0;
    }

    GameObject.prototype.update = function (seconds) {

        this._handleInput(seconds);

        this.getState().update(this, seconds);

    };

    GameObject.prototype._handleInput = function (seconds) {
        let commands = this.inputComponent.handleInput();
        for (i = 0; i < commands.length; i++) {
            commands[i].execute(this, seconds);
        }

        if (commands.length === 0)
            this.getState().stop(this);

    };

    GameObject.prototype.getState = function () {
        return this.stateComponent;
    };

    GameObject.prototype.setState = function (state) {
        this.stateComponent = state;
    };

    GameObject.prototype.getPhysics = function () {
        return this.physicsComponent;
    };

    GameObject.prototype.getGraphics = function () {
        return this.graphicsComponent;
    };

    GameObject.prototype.getInputs = function () {
        return this.inputComponent;
    };

    return {
        createGameObject: function (physicsComponent, graphicsComponent, inputComponent, stateComponent) {
            return new GameObject(physicsComponent, graphicsComponent, inputComponent, stateComponent);
        },
        GameObject: GameObject
    };
});