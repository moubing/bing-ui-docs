<script setup lang="ts">
import { ref } from 'vue'
import { BingInput } from '@moubing/bing-ui'
import { Mail, Search, Sparkles } from 'lucide-vue-next'
import '@moubing/bing-ui/style.css'

const keyword = ref<string | number | null>('button')
const email = ref<string | number | null>('hello@bing-ui.dev')
const effect = ref<string | number | null>('spark')
</script>

<template>
  <div style="display: grid; gap: 16px">
    <BingInput v-model="keyword" :icon="Search" type="search" placeholder="搜索组件" ariaLabel="搜索组件" />
    <BingInput v-model="email" :icon="Mail" type="email" placeholder="邮箱地址" ariaLabel="邮箱地址">
      <template #icon><span aria-hidden="true">M</span></template>
    </BingInput>
    <BingInput v-model="effect" clearable :icon="Sparkles" clearAriaLabel="清空关键词" ariaLabel="动效关键词" />
  </div>
</template>
