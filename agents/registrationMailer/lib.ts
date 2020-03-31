import { readFileSync } from "fs"
import { join } from "path"
import markdown from "markdown-it"
import frontmatter from "front-matter"
import htmltotext from "html-to-text"

export type Template = {
    name: string
    source: string
    version: string
}

export type Message = {
    subject: string,
    text: string,
    body: string,
    metadata: any
}
type ReplacerFunction = (...args:string[]) => Promise<string>
type Replacer = string | ReplacerFunction

// credit: https://dev.to/ycmjason/stringprototypereplace-asynchronously-28k9
async function asyncStringReplace(str:string, regex:RegExp, aReplacer:Replacer):Promise<string> {
    const substrs = []
    let match
    let i = 0
    while ((match = regex.exec(str)) !== null) {
        substrs.push(str.slice(i, match.index))
        substrs.push(typeof aReplacer === "function" ? (await aReplacer(...match)) : aReplacer)
        i = regex.lastIndex
    }
    substrs.push(str.slice(i))
    return (await Promise.all(substrs)).join('')
};

export async function findTemplate(name: string): Promise<Template> {
    try {
        const dir = process.env.TEMPLATE_PATH || join(__dirname, "templates")
        const source = readFileSync(join(dir, `${name}.md`)).toString()
        return {
            name,
            source,
            version: "0"
        }
    } catch (e) {
        throw Error("resource not found")
    }
}

export async function compileTemplate(template:Template, replacements:any = {}): Promise<Message> {
    const md = markdown({
        html: true,
        xhtmlOut: true,
        typographer: true
    })
    const replacementKeys = Object.keys(replacements)
    const replace = async (source:string): Promise<string> => {
        return await asyncStringReplace(source, /\{\s*([^\{\s]*)\s*\}/gm, async (_:string, substring:string) => {
            if (replacementKeys && replacementKeys.indexOf(substring) >= 0) {
                if (typeof replacements[substring] === "function") {
                    return await replacements[substring]()
                }
                if (/\.md$/.test(replacements[substring])) {
                    return await replace((await findTemplate(replacements[substring])).source)
                }
                return replacements[substring]
            }
            return substring
        })
    }
    let source = await replace(template.source)
    
    const fm = frontmatter(await source)
    const body = md.render(await fm.body)
    const text = htmltotext.fromString(body)
    return {
        subject: (fm.attributes as any).subject || "",
        body,
        text,
        metadata: fm.attributes
    }
}