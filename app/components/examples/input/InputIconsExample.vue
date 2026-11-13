<script setup lang="ts">
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import { BingCodeBlock, BingInput } from '@moubing/bing-ui'
import { useExamples } from './state'
const { SearchIcon, SparklesIcon, iconCode } = useExamples()
const keyword = ref<string | number | null>('button')
const email = ref<string | number | null>('hello@bing-ui.dev')
const effect = ref<string | number | null>('spark')
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview">
      <p class="preview-label">图标输入</p>
      <div class="input-demo-stack">
        <ClientOnly>
          <BingInput
            v-model="keyword"
            :icon="SearchIcon"
            type="search"
            placeholder="搜索组件"
          />
          <BingInput v-model="email" :icon="Mail" type="email" placeholder="邮箱地址">
            <template #icon>
              <span class="input-custom-icon" aria-hidden="true">M</span>
            </template>
          </BingInput>
          <BingInput
            v-model="effect"
            clearable
            :icon="SparklesIcon"
            clear-aria-label="清空关键词"
            placeholder="动效关键词"
          />
        </ClientOnly>
      </div>
    </div>
  </div>

  <BingCodeBlock :code="iconCode" language="vue" title="代码示例" wrap />
</template>
