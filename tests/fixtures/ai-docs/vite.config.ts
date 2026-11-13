import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import { uiCandidate } from '../../../scripts/lib/ui-candidate.ts'
import { componentDefinitions, componentSlugs, extractVueExamples, type ComponentSlug } from '../../../scripts/lib/ai-docs.ts'

const virtualDirectory = normalizePath(fileURLToPath(new URL('./.generated/', import.meta.url)))

export default defineConfig({
  resolve: { dedupe: ['vue', 'gsap'], alias: uiCandidate()?.alias },
  root: fileURLToPath(new URL('.', import.meta.url)),
  // 从磁盘上的用例预扫描依赖，避免扫描器直接读取虚拟 Vue 文件。
  optimizeDeps: { entries: ['./*.vue'], exclude: uiCandidate() ? ['@moubing/bing-ui'] : [] },
  plugins: [
    {
      name: 'examples-from-exported-markdown',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'virtual:docs-registry') return '\0docs-registry'
        if (/^virtual:docs\/[a-z-]+\/[a-z-]+\.vue$/.test(id)) return virtualDirectory + id.slice('virtual:'.length)
        if (/^virtual:ai-(form-(layout|methods|manual|no-required)|form-item-(message|span|slot|hidden|disabled|clamped|stack))\.vue$/.test(id)) {
          return virtualDirectory + id.slice('virtual:'.length)
        }
      },
      async load(id) {
        if (id === '\0docs-registry') {
          const entries = componentSlugs.flatMap(slug => Object.values(componentDefinitions[slug].examples)
            .map(name => JSON.stringify(slug + '/' + name) + ': () => import(' + JSON.stringify('virtual:docs/' + slug + '/' + name + '.vue') + ')'))
          return 'export default {' + entries.join(',') + '}'
        }
        if (id.startsWith(virtualDirectory + 'docs/') && !id.includes('?')) {
          const [slug, filename] = id.slice((virtualDirectory + 'docs/').length).split('/')
          if (!componentSlugs.includes(slug as ComponentSlug)) throw new Error('未登记的组件：' + slug)
          const names = Object.values(componentDefinitions[slug as ComponentSlug].examples) as string[]
          const index = names.indexOf(filename!.slice(0, -4))
          if (index < 0) throw new Error('未登记的示例：' + id)
          const markdown = await readFile(new URL('../../../public/ai/components/' + slug + '.md', import.meta.url), 'utf8')
          const examples = await extractVueExamples(markdown)
          if (examples.length !== names.length) throw new Error(slug + ' 导出示例数量不符')
          return examples[index]!
        }
        if (!id.startsWith(virtualDirectory + 'ai-form-') || id.includes('?')) return
        // 严格从生成文档取代码，不使用页面里的运行逻辑或自动导入。
        if (id.startsWith(virtualDirectory + 'ai-form-item-')) {
          const markdown = await readFile(new URL('../../../public/ai/components/form-item.md', import.meta.url), 'utf8')
          const examples = await extractVueExamples(markdown)
          if (examples.length !== 3) throw new Error('FormItem 生成文档必须提供三个 Vue 示例')
          const name = id.slice((virtualDirectory + 'ai-form-item-').length, -4)
          if (name === 'slot') return examples[2]!
          if (name === 'span') return examples[1]!
          if (name === 'clamped') return examples[1]!.replace(/"notesSpan": \{[^}]+\}/, '"notesSpan": 99')
          if (name === 'stack') return examples[1]!.replace('layout="grid"', 'layout="stack"')
          if (name === 'hidden') return examples[0]!.replace('"showMessage": true', '"showMessage": false').replace('"required": true', '"required": false')
          if (name === 'disabled') return examples[0]!.replace('"disabled": false', '"disabled": true')
          return examples[0]!
        }
        const markdown = await readFile(new URL('../../../public/ai/components/form.md', import.meta.url), 'utf8')
        const examples = await extractVueExamples(markdown)
        if (examples.length !== 3) throw new Error('生成文档必须提供三个 Vue 示例')
        if (id.endsWith('methods.vue')) return examples[1]!
        if (id.endsWith('manual.vue')) {
          if (!/"validateTrigger": \[[^\]]+\]/.test(examples[0]!)) throw new Error('缺少校验触发配置')
          return examples[0]!.replace(/"validateTrigger": \[[^\]]+\]/, '"validateTrigger": ["manual"]')
        }
        if (id.endsWith('no-required.vue')) return examples[0]!.replaceAll(' required>', '>')
        return examples[0]!
      },
    },
    vue(),
  ],
  server: { host: '127.0.0.1', port: Number(process.env.AI_DOCS_TEST_PORT || 3108), strictPort: true },
})
