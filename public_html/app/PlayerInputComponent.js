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
	function PlayerInputComponent(moveForwardCommand, moveBackwardCommand, rotateLeftCommand, rotateRightCommand) {
		this.codes = { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward' };
        this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
		this.buttonForward = moveForwardCommand;
		this.buttonBackward = moveBackwardCommand;
		this.buttonLeft = rotateLeftCommand;
		this.buttonRight = rotateRightCommand;
		
        document.addEventListener('keydown', this.onKey.bind(this, true), false);
        document.addEventListener('keyup', this.onKey.bind(this, false), false);
	}
	
	PlayerInputComponent.prototype.onKey = function (val,e) {
		let state = this.codes[e.keyCode];
		if (typeof state === 'undefined')
			return;
		this.states[state] = val;
		e.preventDefault && e.preventDefault();
		e.stopPropagation && e.stopPropagation();
	};
	
	PlayerInputComponent.prototype.handleInput = function () {
		let buttons = [];
		
		if (this.states.left)
			buttons.push(this.buttonLeft);
		if (this.states.right)
			buttons.push(this.buttonRight);
		if (this.states.forward)
			buttons.push(this.buttonForward);
		if (this.states.backward)
			buttons.push(this.buttonBackward);
		
		return buttons;
	};
	
	return {
        createPlayerInputComponent: function(moveForwardCommand, moveBackwardCommand, rotateLeftCommand, rotateRightCommand) {
            return new PlayerInputComponent(moveForwardCommand, moveBackwardCommand, rotateLeftCommand, rotateRightCommand);
        },
		PlayerInputComponent: PlayerInputComponent
    };
});
