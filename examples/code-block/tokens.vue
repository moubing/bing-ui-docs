<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { BingSelect, getCodeLanguages, highlightCode, normalizeCodeLanguage, resolveCodeTheme, type BingCodeBlockLine, type BingSelectModelValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const language = ref('typescript')
const mode = ref<'light' | 'dark'>('light')
const code = 'const message: string = "你好"\nconsole.log(message)\n'
const options = [{ value: 'text', label: '纯文本' }, ...getCodeLanguages()]
const lines = ref<BingCodeBlockLine[]>([])
function changeLanguage(value: BingSelectModelValue) { if (typeof value === 'string') language.value = value }
function changeMode(value: BingSelectModelValue) { if (value === 'light' || value === 'dark') mode.value = value }
let request = 0
watch([language, mode], async () => {
  const current = ++request
  try {
    const result = await highlightCode(code, normalizeCodeLanguage(language.value), resolveCodeTheme('auto', mode.value))
    if (current === request) lines.value = result
  } catch {
    // 网络或语法加载失败保留原文；不显示过期请求的结果。
    if (current === request) lines.value = []
  }
}, { immediate: true })
onBeforeUnmount(() => { request++ })
</script>

<template>
  <div class="token-example" :class="{ 'token-example--dark': mode === 'dark' }">
    <div class="token-example__controls">
      <BingSelect :model-value="language" :options="options" searchable :clearable="false" ariaLabel="高亮语言" @update:model-value="changeLanguage" />
      <BingSelect :model-value="mode" :options="[{ value: 'light', label: '亮色' }, { value: 'dark', label: '暗色' }]" :clearable="false" ariaLabel="高亮配色" @update:model-value="changeMode" />
    </div>
    <pre aria-label="Token 高亮结果"><code><template v-if="lines.length"><template v-for="(line, index) in lines" :key="line.number"><span v-for="(token, tokenIndex) in line.tokens" :key="tokenIndex" :style="{ color: token.color }">{{ token.content }}</span>{{ index < lines.length - 1 ? '\n' : '' }}</template></template><template v-else>{{ code }}</template></code></pre>
  </div>
</template>

<style scoped>
.token-example { padding: 16px; border-radius: 8px; background: #f4f5f6; color: #20242a; }
.token-example--dark { background: #222830; color: #edf0f5; }
.token-example__controls { display: flex; flex-wrap: wrap; gap: 12px; }
pre { overflow: auto; margin: 16px 0 0; }
</style>
