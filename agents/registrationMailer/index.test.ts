import * as lib from "./lib"
import { readFileSync } from "fs"
const fs = require('fs')

describe('findTemplate', () => {
    it('can load a template', async () => {
        const actual = await lib.findTemplate("signature")
        expect(actual.name).toEqual("signature")
        expect(actual.source).toEqual(require('fs').readFileSync("./templates/signature.md").toString())
        expect(actual.version).toEqual("0")
    })
    it('throws an exception when a template is not found', async () => {
        expect(lib.findTemplate("BOGUS")).rejects.toEqual(Error("resource not found: BOGUS"))
    })
})

describe('compileTemplate', () => {
    it('can replace variables', async () => {
        const actual = await lib.compileTemplate({
            name: "test",
            source:
                `# title
hello {title} {name}

{complex}
`, version: "0"
        }, {
            name: "test",
            title: async () => "mister",
            complex: "func:({name}) => `${name}`"
        })
        const expected = {
            metadata: {},
            subject: "",
            text: "TITLE\nhello mister test\n\ntest",
            body:
                `<h1>title</h1>
<p>hello mister test</p>
<p>test</p>
`}
        expect(actual).toEqual(expected)
    })
    it('can extract frontmatter', async () => {
        const actual = await lib.compileTemplate({
            name: "test",
            source:
                `---
title: foobar
---

# hello`, version: "0"
        })
        const expected = {
            subject: "",
            text: "HELLO",
            body: `<h1>hello</h1>
`,
            metadata: {
                title: "foobar"
            }
        }
        expect(actual).toEqual(expected)
    })
    it('can load a sub template', async () => {
        const spy = jest.spyOn(fs, "readFileSync").mockImplementation(() => "# name = {name}")
        const actual = await lib.compileTemplate({
            version: "0",
            name: "",
            source: `# title
# heading
{file.md}`
        }, {name: "test"})
        const expected = {
            body: `<h1>title</h1>
<h1>heading</h1>
<h1>name = test</h1>
`,
            text: "TITLE\nHEADING\nNAME = TEST",
            metadata: {},
            subject: ""
        }
        spy.mockRestore()
        expect(actual).toEqual(expected)
    })
})
