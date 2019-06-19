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
    function CollisionComponent() {
        
    }

	CollisionComponent.prototype.resolveCollision = function (thisObject, hitObject, distance, seconds) {
		
		let direction = thisObject.motionDirection + Math.PI;
		
		while (direction < 0) {
			direction += (2 * Math.PI);
		}
		
		while (direction >= (2 * Math.PI)) {
			direction -= (2 * Math.PI);
		}
		
		while (Math.sqrt(Math.pow(thisObject.x - hitObject.x, 2) + Math.pow(thisObject.y - hitObject.y, 2)) < ((thisObject.sizeRadius + hitObject.sizeRadius) / 2)) {
			thisObject.x += distance * Math.cos(direction) * 0.1;
			thisObject.y += distance * Math.sin(direction) * 0.1;
		};
	};
	
	CollisionComponent.prototype.resolveCollisionWithWalls = function (object, map, seconds) {
		let direction = object.motionDirection + Math.PI;
		
		while (direction < 0) {
			direction += (2 * Math.PI);
		}
		
		while (direction >= (2 * Math.PI)) {
			direction -= (2 * Math.PI);
		}
		
		/*while(! map.isEmptyCell(object.x + object.sizeRadius * Math.cos(object.motionDirection), object.y)) {
			object.x += object.sizeRadius * Math.cos(direction) * 0.1;
		}
		
		while(! map.isEmptyCell(object.x, object.y + object.sizeRadius * Math.sin(object.motionDirection))) {
			object.y += object.sizeRadius * Math.sin(direction) * 0.1;
		}*/
		
		while(! map.isEmptyCell(object.x + object.sizeRadius * Math.cos(object.motionDirection), object.y + object.sizeRadius * Math.sin(object.motionDirection))) {
			if (map.isEmptyCell(object.x + object.sizeRadius * Math.cos(object.motionDirection), object.y))
				object.y += object.sizeRadius * Math.sin(direction) * 0.1;
				
			if (map.isEmptyCell(object.x, object.y + object.sizeRadius * Math.sin(object.motionDirection)))
				object.y += object.sizeRadius * Math.sin(direction) * 0.1;
		}
	};
	
    return {
        createCollisionComponent: function () {
            return new CollisionComponent();
        },
        CollisionComponent: CollisionComponent
    };
});
