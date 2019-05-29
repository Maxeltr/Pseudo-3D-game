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
    function OrcGameObjectFactory() {

        let mapModule = require('./Map');
        //let nullInputComponentModule = require('./NullInputComponent');
        let aiInputComponentModule = require('./AiInputComponent');
        var commandModule = require('./Command');
        let graphicsComponentModule = require('./GraphicsComponent');
        let physicsComponentModule = require('./PhysicsComponent');
        let stateModule = require('./State');
        let orcSpriteFactoryModule = require('./OrcSpriteFactory');
        let gameObjectModule = require('./GameObject');

        let orcSpriteFactory = orcSpriteFactoryModule.createOrcSpriteFactory();
        let map = mapModule.createMap();
        let physics = physicsComponentModule.createPhysicsComponent(map);
        let graphics = graphicsComponentModule.createGraphicsComponent(orcSpriteFactory());

        return function () {
            let gameObject = gameObjectModule.createGameObject(
                    physics,
                    graphics,
                    aiInputComponentModule.createAiInputComponent(
                            new commandModule.MoveForwardCommand(),
                            new commandModule.MoveBackwardCommand(),
                            new commandModule.RotateLeftCommand(),
                            new commandModule.RotateRightCommand(),
                            new commandModule.ShootCommand(),
                            map
                            ),
                    stateModule.createStateContainer().getStopState()
                    );

            gameObject.name = 'orc';

            return gameObject;
        };
    }

    return {
        createOrcGameObjectFactory: function () {
            return new OrcGameObjectFactory();
        },
        OrcGameObjectFactory: OrcGameObjectFactory
    };
});