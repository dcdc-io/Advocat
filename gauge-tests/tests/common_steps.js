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


step("Search for groups in Leeds <location>", async(location)=> {
	await click("find groups");
	await write(location);
});

step("Verify user has found groups <location>", async(location) => {
	assert.ok(await text(location).exists());
});

step("Create a group <groupName>", async(groupName) => {
	await click("create a group");
	await write(groupName);
});

step("Navigate to <pageName> page", async(pageName) => {
    let pageUrl;
    switch(pageName){
	case "home":
		pageUrl = "https://advocat.dev"
		break;
	case "about":
		pageUrl = "https://advocat.dev/about"
		break;
	case "jobs":
		pageUrl = "https://advocat.dev/jobs"
		break;
	case "advocats":
		pageUrl = "https://advocat.dev/advocats";
		break;
	case "login":
		pageUrl = "https://advocat.dev/login";
		break;
	case "register":
		pageUrl = "https://advocat.dev/register";
		break;
	default:
		pageUrl = "https://advocat.dev"
    }
    await goto(pageUrl);
});