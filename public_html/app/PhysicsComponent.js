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
    function PhysicsComponent(map) {
        this.map = map;
    }

    PhysicsComponent.prototype.rotate = function (object, seconds) {
        let angle = object.rotationVelocity * seconds;
        object.direction = (object.direction + angle + Math.PI * 2) % (Math.PI * 2);
    };

    PhysicsComponent.prototype.move = function (object, seconds) {
        let distance = seconds * object.movementVelocity;
        let dx = Math.cos(object.direction) * distance;
        let dy = Math.sin(object.direction) * distance;
        let moveDirection = object.direction;
        let xCollision = false, yCollision = false;

        if (distance < 0)
            moveDirection += Math.PI;

        if (this.map.checkCollisionsWithWalls(object.x + dx, object.y, moveDirection, object.sizeRadius)) {
            object.x += dx;
        } else {
            xCollision = true;
        }

        if (this.map.checkCollisionsWithWalls(object.x, object.y + dy, moveDirection, object.sizeRadius)) {
            object.y += dy;
        } else {
            yCollision = true;
        }


        if (!xCollision || !yCollision) {
            object.paces += Math.abs(distance);
        }

        return {'xCollision': xCollision, 'yCollision': yCollision};
    };

    return {
        createPhysicsComponent: function (map) {
            return new PhysicsComponent(map);
        },
        PhysicsComponent: PhysicsComponent
    };
});
