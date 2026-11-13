import { uiCandidate } from './scripts/lib/ui-candidate'
const candidate = uiCandidate()
export default defineNuxtConfig({
  alias: candidate?.alias,
  imports: candidate?.imports,
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@comark/nuxt'],
  // API 表也由 Node 原生 TypeScript 导出工具读取，共享模块保留 .ts 扩展。
  typescript: {
    tsConfig: { compilerOptions: { allowImportingTsExtensions: true } },
    sharedTsConfig: { compilerOptions: { allowImportingTsExtensions: true } },
  },
  css: ['@moubing/bing-ui/style.css', '~/assets/css/main.css'],
  vite: {
    server: candidate ? { fs: { allow: [candidate.directory] } } : undefined,
    resolve: { dedupe: ['vue', 'gsap'] },
    optimizeDeps: {
      // 文档示例按路由加载，提前预编译依赖，避免首次切页发现新依赖后整页重载。
      // 候选包重建会改变 scoped CSS 标识，直接加载以免复用旧预编译脚本。
      include: [...(candidate ? [] : ['@moubing/bing-ui']), 'gsap', 'lucide-vue-next', 'zod'],
      exclude: candidate ? ['@moubing/bing-ui'] : [],
    },
  },
  app: {
    keepalive: true,
    pageTransition: { name: 'docs-page', mode: 'out-in' },
    head: {
      title: 'Bing UI',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico?v=3',
        },
      ],
      script: [
        {
          key: 'bing-ui-docs-theme',
          innerHTML: `(function () {
  try {
    var theme = localStorage.getItem('bing-ui-docs-theme')
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      document.documentElement.dataset.bingTheme = theme
    }
  } catch (error) {}
})()`,
        },
      ],
    },
  },
})
