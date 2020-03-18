"use strict";

const { openBrowser, reload, write, evaluate, closeBrowser, below, rightClick, goto, $, above, press, click, waitFor, near, into, screenshot, dropDown, text, focus, textBox, toRightOf, toLeftOf, button } = require('taiko');
const assert = require('assert');
const fetch = require("node-fetch");
const fsPromises = require('fs').promises;

beforeSuite(async () => {
    await openBrowser({
        headless: false, 
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process']
    });
});

afterSuite(async () => {
    await closeBrowser();
});

gauge.screenshotFn = async function () {
    return await screenshot({ encoding: 'base64' });
};


step("Navigate to Advocat.", async() => {
	await goto("localhost:3003");
});

step("Search for groups in Leeds <location>", async(location)=> {
	click("find groups");
	write(location);
});

step("Verify user has found groups <location>", async function(location) {
	assert.ok(await text(location).exists());
});

step("Create a group <groupName>", async function(groupName) {
	click("create a group");
	write(groupName);
});