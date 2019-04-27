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
    function Camera(width, height) {
        this.height = height;
        this.width = width;
        this.canvas;
        this.context;
        this.depthBuffer = [];
    }

    Camera.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
        this.context.msImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
    };

    Camera.prototype.drawBackground = function (bitmap, direction) {
        var width = bitmap.width * (this.height / bitmap.height) * 2;
        var left = (direction / (Math.PI * 2)) * -width;

        this.context.save();
        this.context.drawImage(bitmap.image, left, 0, width, this.height);
        if (left < width - this.width) {
            this.context.drawImage(bitmap.image, left + width, 0, width, this.height);
        }
        this.context.restore();
    };

    Camera.prototype.drawMap = function (map, color) {
        let hMapScaleRatio = this.width / map.width;
        let vMapScaleRatio = this.height / map.height;

        this.context.save();
        for (let j = 0; j < map.height; j++) {
            for (let i = 0; i < map.width; i++) {
                if (map.walls[i + j * map.width] === undefined) {
                    continue;
                }
                this.context.fillStyle = color;
                this.context.fillRect(i * hMapScaleRatio, j * vMapScaleRatio, hMapScaleRatio, vMapScaleRatio);
            }
        }
        this.context.restore();
    };

    Camera.prototype.drawRect = function (x, y, width, height, color) {
        this.context.save();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
        this.context.restore();
    };

    Camera.prototype.drawObjectsOnMap = function (objects, map, color) {
        for (let j = 0; j < objects.length; j++) {
            this.drawObjectOnMap(objects[j], map, color);
        }
    };

    Camera.prototype.drawObjectOnMap = function (object, map, color) {
        let hMapScaleRatio = this.width / map.width;
        let vMapScaleRatio = this.height / map.height;
        let width = object.sizeRadius * hMapScaleRatio;
        let height = object.sizeRadius * vMapScaleRatio;
        let centerX = object.x * hMapScaleRatio - width / 2;
        let centerY = object.y * vMapScaleRatio - height / 2;

        this.drawRect(centerX, centerY, width, height, color);
    };

    Camera.prototype.drawHands = function (bitmap, paces) {

    };

    Camera.prototype.clearScreen = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    Camera.prototype.drawWalls = function (x, y, direction, fov, map, bitmap) {
        let angle = 0.0, ray, columnHeight, columnTop, textureX, leftEdge, angleBetweenRays;

        leftEdge = direction - fov / 2;
        angleBetweenRays = fov / this.width;

        this.context.save();
        for (let i = 0; i < this.width; i++) {                                                      //step define amount of rays
            angle = leftEdge + angleBetweenRays * i;
            ray = map.castRay(x, y, direction, angle, 0.01, true);
            this.depthBuffer[i] = ray.distance;
            columnHeight = Math.min(1000, this.height / ray.distance);
            columnTop = this.height / 2 - columnHeight / 2;
            textureX = this._getTextureX(ray, bitmap);
            this.context.drawImage(bitmap.image, textureX, 0, 1, bitmap.height, i, columnTop, 1, columnHeight);
        }
        this.context.restore();
    };

    Camera.prototype._getTextureX = function (ray, bitmap) {
        let hitX, hitY, textureX;

        hitX = ray.x - Math.floor(ray.x + 0.5);                                                   //get fractional part of x
        hitY = ray.y - Math.floor(ray.y + 0.5);                                                   //get fractional part of y
        textureX = hitX * bitmap.hFrameSize;
        if (Math.abs(hitY) > Math.abs(hitX))
            textureX = hitY * bitmap.vFrameSize;
        if (textureX < 0)
            textureX += bitmap.hFrameSize;

        return ray.barrier * bitmap.hFrameSize + textureX;
    };

    Camera.prototype.drawFovsOnMap = function (objects, map, color) {
        for (let j = 0; j < objects.length; j++) {
            this.drawFovOnMap(objects[j], map, color);
        }
    }

    Camera.prototype.drawFovOnMap = function (object, map, color) {
        let left, right, rays = [], step = 0.5;

        left = object.direction - object.fov / 2;
        right = object.direction + object.fov / 2;
        rays.push(map.castRay(object.x, object.y, object.direction, left, step, true));
        rays.push(map.castRay(object.x, object.y, object.direction, object.direction, step, true));
        rays.push(map.castRay(object.x, object.y, object.direction, right, step, true));

        this.drawRaysOnMap(rays, map, color);
    }

    Camera.prototype.drawRaysOnMap = function (rays, map, color) {
        for (let j = 0; j < rays.length; j++) {
            this.drawRayOnMap(rays[j], map, color);
        }
    }

    Camera.prototype.drawRayOnMap = function (ray, map, color) {
        let x, y, hMapScaleRatio, vMapScaleRatio;

        hMapScaleRatio = this.width / map.width;
        vMapScaleRatio = this.height / map.height;

        this.context.save();
        this.context.fillStyle = color;

        for (let j = 0; j < ray.trace.length; j++) {
            x = Math.floor(ray.trace[j].x * hMapScaleRatio);                                     //scale to screen
            y = Math.floor(ray.trace[j].y * vMapScaleRatio);                                       //scale to screen
            this.context.fillRect(x, y, 1, 1); //draw a pixel of the ray with color
        }
        this.context.restore();
    }


    return {
        createCamera: function (width, height) {
            return new Camera(width, height);
        }
    };
});
