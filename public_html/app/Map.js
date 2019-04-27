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
    function Map() {
        this.width = 16;
        this.height = 16;
        this.walls = [
            2, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0, 4, 0,
            0, , , , , , , , , , , , , , , 3,
            5, , , , , , , , , , , , , , , 0,
            0, , , , , , , , , , , , , 2, 2, 3,
            5, , , , , , , , , , , , , 2, , 0,
            0, , , , , , , , , , , , , 2, , 3,
            5, , , , , , , , , , , , , 2, , 0,
            0, , , , , , , , , , , , , 2, , 3,
            5, , , , , , , , , , , , , , , 0,
            0, , , , , , , , , , , , , 2, 2, 3,
            5, , , , , , , , , , , , , , , 0,
            0, , , , , , , , , , , , , , , 3,
            5, , , , , , , , , , , , , , , 0,
            0, , , , , , , , , , , , , , , 3,
            5, , , , , , , , , , , , , , , 0,
            0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1
        ];
    }

    Map.prototype.isEmptyCell = function (x, y) {
        return this.walls[Math.floor(x) + Math.floor(y) * this.width] === undefined;
    };

    Map.prototype.checkCollisionsWithWalls = function (x, y, direction, radius) {	//degrees - rad, 0-0, 90-‪1.570796‬, 180-‪3.141593‬, 270-‪4.712389‬
        while (direction < 0) {
            direction += (2 * Math.PI);
        }
        while (direction >= (2 * Math.PI)) {
            direction -= (2 * Math.PI);
        }

        if (direction >= 0 && direction <= 1.571) {
            return this.isEmptyCell(x + radius, y + radius);
        } else if (direction > 1.571 && direction <= 3.142) {
            return this.isEmptyCell(x - radius, y + radius);
        } else if (direction > 3.142 && direction <= 4.712) {
            return this.isEmptyCell(x - radius, y - radius);
        } else if (direction > 4.712 && direction <= 6.2832) {
            return this.isEmptyCell(x + radius, y - radius);
        }
    };

    Map.prototype.castRay = function (x, y, direction, angle, step, saveTrace) {
        let textureId, cx, cy, distance, steps;
        let increment = step || 0.01;
        let trace = [];

        for (steps = 0; steps < 20; steps += increment) {                                               //step of the ray
            cx = x + steps * Math.cos(angle);                                                    //x coordinate of ray
            cy = y + steps * Math.sin(angle);                                                    //y coordinate of ray
            if (saveTrace) {
                trace.push({x: cx, y: cy});
            }
            textureId = this.walls[Math.floor(cx) + Math.floor(cy) * this.width];
            if (textureId !== undefined)
                break;
        }
        distance = steps * Math.cos(angle - direction);

        return {x: cx, y: cy, distance: distance, barrier: textureId, trace: trace};
    };

    return {
		createMap: function() {
            return new Map();
        }
    };
});

