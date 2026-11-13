<script setup lang="ts">
import { docsVersion, migrationSlugs } from '#shared/docs/migration'
import { upgradeGuideTitle } from '#shared/docs/release'
import { BingCodeBlock } from '@moubing/bing-ui'

definePageMeta({
  layout: 'docs',
})

const installCommands = [
  { value: 'pnpm', label: 'pnpm', code: `pnpm add @moubing/bing-ui@${docsVersion.packageVersion} gsap@^3.15.0`, language: 'shellscript' },
  { value: 'npm', label: 'npm', code: `npm install @moubing/bing-ui@${docsVersion.packageVersion} gsap@^3.15.0`, language: 'shellscript' },
  { value: 'yarn', label: 'yarn', code: `yarn add @moubing/bing-ui@${docsVersion.packageVersion} gsap@^3.15.0`, language: 'shellscript' },
]

const nuxtCode = `export default defineNuxtConfig({
  css: ['@moubing/bing-ui/style.css'],
})`

const styleCode = `import '@moubing/bing-ui/style.css'`

const usageCode = `<script setup lang="ts">
import { BingButton } from '@moubing/bing-ui'
<${'/'}script>

<template>
  <BingButton variant="primary">开始使用</BingButton>
</template>`

const configCode = `<script setup lang="ts">
import { BingConfigProvider } from '@moubing/bing-ui'
<${'/'}script>

<template>
  <BingConfigProvider size="sm" :z-index="3000" reduced-motion="user">
    <RouterView />
  </BingConfigProvider>
</template>`

const themeCode = `type BingTheme = 'light' | 'dark' | 'system'

function setTheme(theme: BingTheme) {
  document.documentElement.dataset.bingTheme = theme
  try { localStorage.setItem('bing-ui-theme', theme) } catch {}
}

setTheme('dark')`

const restoreThemeCode = `<script>
  try {
    const theme = localStorage.getItem('bing-ui-theme')
    if (theme === 'light' || theme === 'dark' || theme === 'system') {
      document.documentElement.dataset.bingTheme = theme
    }
  } catch {}
<${'/'}script>`

const themeOverrideCode = `html[data-bing-theme='dark'] {
  --bing-accent-rgb: 139 92 246;
  --bing-accent-strong-rgb: 196 181 253;
  --bing-accent-solid-rgb: 167 139 250;
  --bing-accent: rgb(var(--bing-accent-rgb));
  --bing-accent-strong: rgb(var(--bing-accent-strong-rgb));
  --bing-accent-solid: rgb(var(--bing-accent-solid-rgb));
  --bing-accent-soft: rgb(var(--bing-accent-rgb) / 0.16);
  --bing-accent-contrast: #0f172a;
  --bing-focus: rgb(var(--bing-accent-rgb) / 0.62);
  --bing-focus-ring: rgb(var(--bing-accent-rgb));
}`
</script>

<template>
  <article class="doc-page" data-docs-route="/docs">
    <p class="eyebrow">快速开始</p>
    <h1 id="overview">快速开始</h1>
    <p>
      在 Vue 3 项目中安装 Bing UI、导入样式，再按需使用组件。当前文档对应 {{ docsVersion.packageVersion }}，覆盖 {{ migrationSlugs.length }} 个组件及完整交互示例。
    </p>

    <DocsCallout type="info" title="从旧版升级">
      已有项目请先阅读 <NuxtLink to="/docs/upgrade">{{ upgradeGuideTitle }}</NuxtLink>，核对产物格式、依赖和默认行为变化，再逐页验证业务交互。
    </DocsCallout>

    <h2 id="usage">使用方式</h2>
    <p>
      需要 Vue 3.5 及 GSAP 3.15 系列。以下命令用于已有 Vue 项目；新项目先建立 Vue 3 单文件组件环境。Zod 是可选 peer 依赖：使用 Form 的 schema 校验时需要自行安装 <code>zod@^4</code>，不用时无需安装。
      0.12.4 起公共类型也不再依赖 Zod，未安装时可正常进行严格类型检查。
    </p>
    <p>
      组件库只提供 ESM 多文件产物，不再提供 UMD / CommonJS 入口；通过 Vite、Nuxt 或其他支持 ESM 的打包器使用，未用到的组件会被摇树移除。
    </p>

    <DocsSteps>
      <DocsStep title="安装组件库">
        <DocsCodeGroup :items="installCommands" default-value="pnpm" aria-label="选择包管理器" />
        <DocsCallout type="tip" title="包管理器提示">
          同一个项目中请沿用现有锁文件对应的包管理器，避免生成多份锁文件。
        </DocsCallout>
      </DocsStep>

      <DocsStep title="引入组件样式">
        <p>在应用入口或 Nuxt 配置中引入 Bing UI 的样式文件。</p>
        <BingCodeBlock :code="styleCode" language="ts" title="应用入口" />
      </DocsStep>

      <DocsStep title="使用组件">
        <p>从包中按需导入组件，即可在模板中直接使用。</p>
        <BingCodeBlock :code="usageCode" language="vue" title="App.vue" wrap />
      </DocsStep>
    </DocsSteps>

    <h2 id="nuxt">Nuxt 接入</h2>
    <p>在 Nuxt 配置中全局引入样式，页面中的组件仍使用显式 import。Bing UI 没有要求安装专用 Nuxt 模块，也不会自动注册全部组件。</p>
    <BingCodeBlock :code="nuxtCode" language="ts" title="nuxt.config.ts" />
    <DocsDetails label="按需处理" title="哪些场景使用 ClientOnly？">
      <p>常规组件可正常服务端渲染。业务若直接读取 window/document、挂载依赖浏览器的预览或第三方内容，应放到 onMounted 中，或使用 Nuxt 的 ClientOnly 包裹该部分。保留清楚的 fallback，避免页面等待期间布局跳动。</p>
    </DocsDetails>

    <h2 id="config">全局配置</h2>
    <p>
      用 <NuxtLink to="/docs/components/config-provider">BingConfigProvider</NuxtLink> 包住应用或某个区域，可以统一设置默认尺寸 <code>size</code>、浮层层级基准 <code>zIndex</code>（默认 2000）和 JS 动效策略 <code>reducedMotion</code>。
      组件显式传入的 props 始终优先，嵌套的 Provider 只覆盖自己设置的字段；不放 Provider 时组件保持原有默认值。
    </p>
    <BingCodeBlock :code="configCode" language="vue" title="App.vue" wrap />

    <h2 id="themes">主题</h2>
    <p>
      Bing UI 支持 <code>light</code>、<code>dark</code> 和 <code>system</code> 三种主题。把
      <code>data-bing-theme</code> 设置在 <code>html</code> 元素上，页面内组件以及挂载到
      <code>body</code> 的浮层都能继承同一套主题变量；未设置时默认使用亮色主题。
    </p>
    <p>
      默认主题使用中性灰黑、实色表面、细边框和轻阴影；深色表面为炭灰。粉色、蓝色等色阶仍可用于业务状态与品牌装饰。下面的紫色配置是自定义品牌示例，并非默认主题。
    </p>

    <DocsSteps>
      <DocsStep title="切换并保存主题">
        <p>主题状态由应用持有，切换时更新根元素属性，并按需写入本地存储。</p>
        <BingCodeBlock :code="themeCode" language="ts" title="theme.ts" />
      </DocsStep>

      <DocsStep title="在应用挂载前恢复">
        <p>
          将恢复脚本放进文档的 <code>head</code>，并让它早于应用脚本执行，可避免刷新暗色页面时先闪出亮色背景。
        </p>
        <BingCodeBlock :code="restoreThemeCode" language="html" title="app.html" wrap />
      </DocsStep>

      <DocsStep title="覆盖品牌语义变量">
        <p>
          业务主题优先在根元素覆盖语义变量，并同步维护颜色值与对应 RGB channel；不要批量替换组件内部颜色，
          这样半透明交互态、焦点环和浮层也能继承完整的品牌配置。
        </p>
        <BingCodeBlock :code="themeOverrideCode" language="css" title="theme.css" />
      </DocsStep>
    </DocsSteps>

    <DocsCallout type="tip" title="System 主题如何工作？">
      <code>system</code> 会跟随操作系统的 <code>prefers-color-scheme</code>，系统外观变化时不需要额外刷新页面。
      如果应用会使用 Dialog、Select 或 Tooltip 等浮层组件，请继续把主题属性设置在 <code>html</code>，而不是局部容器。
    </DocsCallout>

    <p>0.18.0 新增全局 <code>--bing-focus-ring</code>，为键盘焦点提供实色轮廓；原有 <code>--bing-focus</code> 继续用于柔和光晕。自定义品牌应在亮暗表面分别检查轮廓对比度。Table 的焦点、活动行、选中行及固定列阴影使用公开主题变量，详见 <NuxtLink to="/docs/components/table#theme">Table 主题规范</NuxtLink>。</p>

    <h2 id="sizes">尺寸与磨砂</h2>
    <p>常规输入与选择控件的 sm / md / lg 高度为 32 / 36 / 40px；Button 另外提供 xs=28px、xl=44px。未显式设置尺寸时，控件依次继承 FormItem、Form 和 BingConfigProvider，最终为 md。Table 行高、复选框选中框及其他特殊控件请查看对应 API，不能套用统一高度。</p>
    <p>支持磨砂的组件默认从主题继承模糊 16px、饱和度 1.05，以及浅色 0.86 / 深色 0.92 的底色不透明度。显式设置 glassOpacity 等参数会覆盖主题值；只有需要演示差异时才固定这些数值。</p>

    <h2 id="api">查阅接口与示例</h2>
    <p>从 <NuxtLink to="/docs/components/button">Button</NuxtLink> 了解基础控件，使用 <NuxtLink to="/docs/components/form">Form</NuxtLink> 组织表单，或在 <NuxtLink to="/docs/components/cursor">Cursor</NuxtLink> 体验原生绘制的光标。各组件页包含完整可复制的 Vue 单文件示例及 Props、事件、插槽和公开方法说明。</p>
    <p>需要供 AI 阅读的纯文本版本时，使用 <a href="/llms.txt">AI 文档入口</a>，并通过 <a href="/ai/manifest.json">版本清单</a> 确认适用版本。</p>
  </article>
</template>

<style scoped>
.doc-page a { text-decoration: underline; text-underline-offset: 3px; }
.doc-page > :deep(.docs-callout),
.doc-page > :deep(.docs-details) {
  margin-block: 1.25rem;
}

.doc-page :deep(.docs-details__content-inner ul) {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding-left: 1.25rem;
}
</style>
