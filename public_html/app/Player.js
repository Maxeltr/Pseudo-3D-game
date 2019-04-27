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
    function Player(x, y, direction) {
        this.x = x || 3.456;
        this.y = y || 2.345;
        this.direction = direction || 1.523;    //player view direction degrees - rad, 0-0, 90-‪1.570796‬, 180-‪3.141593‬, 270-‪4.712389‬
        this.paces = 0;
        this.circle = Math.PI * 2;
        this.fov = Math.PI / 3.0;               //field of view
        this.sizeRadius = 0.1;		//calculate in depence of map size
        this.velocity = 2.5;
        this.distanceToPlayer = 0.001;
    }

    Player.prototype.rotate = function (angle) {
        this.direction = (this.direction + angle + this.circle) % this.circle;
    };

    Player.prototype.update = function (controls, map, seconds) {
        if (controls.left)
            this.rotate(-Math.PI * seconds);
        if (controls.right)
            this.rotate(Math.PI * seconds);
        if (controls.forward)
            this.move(map, this.velocity * seconds);
        if (controls.backward)
            this.move(map, -this.velocity * seconds);
    };

    Player.prototype.move = function (map, distance) {
        let dx = Math.cos(this.direction) * distance;
        let dy = Math.sin(this.direction) * distance;
        let moveDirection = this.direction;

        if (distance < 0)
            moveDirection += Math.PI;

        if (map.checkCollisionsWithWalls(this.x + dx, this.y, moveDirection, this.sizeRadius))
            this.x += dx;
        if (map.checkCollisionsWithWalls(this.x, this.y + dy, moveDirection, this.sizeRadius))
            this.y += dy;

        this.paces += distance;
    };

    return {
        createPlayer: function (x, y, direction) {
            return new Player(x, y, direction);
        }
    };
});