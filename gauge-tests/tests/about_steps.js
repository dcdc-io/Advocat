"use strict";
const { clear, dragAndDrop, reload, write, below, rightClick, goto, $, above, press, click, waitFor, near, into, dropDown, text, focus, textBox, toRightOf, toLeftOf, button, evaluate } = require('taiko');
const assert = require('assert');

step("Verify test exists on the page <pageText>", async(pageText) => {
	assert.ok(await text(pageText).exists());
});