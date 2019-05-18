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
    function MoveForwardCommand() {
        this.name = 'Forward';
    }

    MoveForwardCommand.prototype.execute = function (actor, seconds) {
        if (typeof actor.getState().move === 'function')
            actor.getState().move(actor, seconds);
    };

    function MoveBackwardCommand() {
        this.name = 'Backward';
    }

    MoveBackwardCommand.prototype.execute = function (actor, seconds) {
        if (typeof actor.getState().move === 'function')
            actor.getState().move(actor, -seconds);
    };

    function RotateLeftCommand() {
        this.name = 'Left';
    }

    RotateLeftCommand.prototype.execute = function (actor, seconds) {
        if (typeof actor.getPhysics().rotate === 'function')
            actor.getPhysics().rotate(actor, -seconds);
    };

    function RotateRightCommand() {
        this.name = 'Right';
    }

    RotateRightCommand.prototype.execute = function (actor, seconds) {
        if (typeof actor.getPhysics().rotate === 'function')
            actor.getPhysics().rotate(actor, seconds);
    };

    function ShootCommand() {
        this.name = 'Shoot';
    }

    ShootCommand.prototype.execute = function (actor, seconds) {
        if (typeof actor.getState().shoot === 'function')
            actor.getState().shoot(actor, seconds);
    };

    return {
        MoveForwardCommand: MoveForwardCommand,
        MoveBackwardCommand: MoveBackwardCommand,
        RotateLeftCommand: RotateLeftCommand,
        RotateRightCommand: RotateRightCommand,
        ShootCommand: ShootCommand
    };
});
