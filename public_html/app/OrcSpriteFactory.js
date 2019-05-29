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

define(function (require) {
    function OrcSpriteFactory() {

        let bitmapModule = require('./Bitmap');
        let spriteModule = require('./Sprite');
        let animationModule = require('./Animation');
        let orcSpriteSheet = bitmapModule.createBitmap('./img/orcSpriteSheet.png', 832, 1344, 64, 64);

        return function () {
            let orcSprite = spriteModule.createSprite('orc', orcSpriteSheet);
            orcSprite.addAnimation(animationModule.createAnimation('stop', 10, 8, 9, 11, 1, 1, 0));
            orcSprite.addAnimation(animationModule.createAnimation('move', 10, 8, 9, 11, 9, 10, 0));
            orcSprite.addAnimation(animationModule.createAnimation('shoot', 18, 16, 17, 19, 12, 1, 0));
            orcSprite.addAnimation(animationModule.createAnimation('continueShooting', 18, 16, 17, 19, 12, 1, 4));
            orcSprite.addAnimation(animationModule.createAnimation('destroy', 20, 20, 20, 20, 6, 0.5, 0));
            orcSprite.setCurrentAnimation('stop');

            return orcSprite;
        };
    }

    return {
        createOrcSpriteFactory: function () {
            return new OrcSpriteFactory();
        },
        OrcSpriteFactory: OrcSpriteFactory
    };
});