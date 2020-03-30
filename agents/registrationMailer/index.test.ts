import * as lib from "./lib"

describe('findTemplate', () => {
    it('can load a template', async () => {
        const actual = await lib.findTemplate("signature")
        expect(actual.name).toEqual("signature")
        expect(actual.source).toEqual(require('fs').readFileSync("./templates/signature.md").toString())
        expect(actual.version).toEqual("0")
    })
    it('throws an exception when a template is not found', async () => {
        expect(lib.findTemplate("BOGUS")).rejects.toEqual(Error("resource not found"))
    })
})

describe('compileTemplate', () => {
    it('can replace variables', async () => {
        const actual = await lib.compileTemplate({
            name: "test",
            source:
                `# title
hello {title} {name}
`, version: "0"
        }, {
            name: "test",
            title: async () => "mister"
        })
        const expected = {
            metadata: {},
            subject: "",
            text: "TITLE\nhello mister test",
            body:
                `<h1>title</h1>
<p>hello mister test</p>
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
})
