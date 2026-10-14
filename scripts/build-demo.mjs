// Builds the demo and pre-renders it to static HTML.
//   1. client bundle -> demo-dist/
//   2. server bundle of src/entry-server.js -> node_modules/.demo-ssr/
//   3. render each view into the built index.html (/ and /docs/)
import { build } from 'vite'
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const root = process.cwd()
const configFile = path.resolve(root, 'vite.demo.config.js')
const ssrDir = path.resolve(root, 'node_modules/.demo-ssr')
const outDir = path.resolve(root, 'demo-dist')

await build({ configFile, logLevel: 'warn' })
await build({
  configFile,
  logLevel: 'warn',
  build: { ssr: path.resolve(root, 'src/entry-server.js'), outDir: ssrDir, emptyOutDir: true },
})

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const template = await readFile(path.join(outDir, 'index.html'), 'utf8')
const pages = [
  { view: 'examples', file: 'index.html' },
  {
    view: 'docs',
    file: 'docs/index.html',
    title: 'Docs · vue-hotel-datepicker',
    description:
      'Props, events, methods and translations for vue-hotel-datepicker, a hotel date range picker for Vue 3.',
  },
]

for (const page of pages) {
  const html = await render(page.view)
  let out = template.replace('<div id="app"></div>', `<div id="app" data-view="${page.view}">${html}</div>`)

  if (out === template) throw new Error('Could not find <div id="app"></div> in the built index.html')

  if (page.title) {
    out = out.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)
    out = out.replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${page.description}" />`,
    )
  }

  const target = path.join(outDir, page.file)

  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, out)
}

await rm(ssrDir, { recursive: true, force: true })
console.log(`Pre-rendered ${pages.length} pages into ${path.relative(root, outDir)}/`)
