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
    function AiManager() {

    }

    AiManager.prototype.update = function (seconds, target, gameObjectManager, map) {
        let states = {};
        for (let gameObject of gameObjectManager.gameObjects.values()) {

            if (this.checkSight(target, gameObject, map)) {
                states = {'forward': true};
                console.log(gameObject.x * target.x + gameObject.y * target.y);

            }

            gameObject.getInputs().setInput(states);
            states = {};
        }
    };

    AiManager.prototype.checkSight = function (target, npc, map) {
        let distanceBetweenNpcAndPlayer, toPlayerDirection, angleBetweenVectors;
        let nNpcX, nNpcY, nTargetX, nTargetY, ray;

        ray = map.castRay(npc.x, npc.y, npc.direction, 0.3, false);	//ray from npc in itself direction

        nNpcX = (ray.x - npc.x) / ray.distance;			//normalize vector sight direction
        nNpcY = (ray.y - npc.y) / ray.distance;			//normalize vector sight direction

        distanceBetweenNpcAndPlayer = Math.sqrt(Math.pow(target.x - npc.x, 2) + Math.pow(target.y - npc.y, 2));	//distance from npc to player

        nTargetX = (target.x - npc.x) / distanceBetweenNpcAndPlayer;						//normalize vector direction to player
        nTargetY = (target.y - npc.y) / distanceBetweenNpcAndPlayer;						//normalize vector direction to player

        angleBetweenVectors = Math.acos(Math.floor((nNpcX * nTargetX + nNpcY * nTargetY) * 1000) / 1000);		//to avoid rounding error, sometimes we get Math.acos(1.0000000002)

        if (angleBetweenVectors < (npc.fov / 2) && distanceBetweenNpcAndPlayer < npc.sightDistance) { 		//player in fov of npc and at sight distance

            toPlayerDirection = Math.atan2(target.y - npc.y, target.x - npc.x);		//direction from npc to player
            ray = map.castRay(npc.x, npc.y, toPlayerDirection, 0.3, false);	//ray from npc in player direction

            if (Math.abs(ray.distance) > distanceBetweenNpcAndPlayer) 		//player is behind wall if distance to wall is less than to player
                return true;
        }

        return false;
    };

    AiManager.prototype._castRay = function (gameObject, map) {
        let states = gameObject.getInputs().states;
        let ray = map.castRay(gameObject.x, gameObject.y, gameObject.direction, 0.1, false);
        if (ray.distance > 0.5) {
            states['forward'] = true;
            states['left'] = false;
        } else {
            states['forward'] = false;
            states['left'] = true;
        }

    };

    return {
        createAiManager: function () {
            return new AiManager();
        },
        GameObjectManager: AiManager
    };
});