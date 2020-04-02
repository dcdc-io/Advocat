const fs = require("fs")
const path = require("path")
const { execSync } = require('child_process');

const files = fs.readdirSync(__dirname).filter(file => /^\d\d\d\d-\d\d-\d\d-\d\d\d\d/.test(file)).sort()
for (const file of files) {
    try { execSync(`node ${file}`) }
    catch(e) {
        
    }
}