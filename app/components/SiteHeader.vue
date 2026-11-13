<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { publicEntries } from '#shared/docs/entries'

type BingTheme = 'light' | 'dark' | 'system'

const themeStorageKey = 'bing-ui-docs-theme'
const themeOptions: Array<{ value: BingTheme, label: string }> = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' },
]

const activeTheme = ref<BingTheme>('light')

function isBingTheme(value: string | null): value is BingTheme {
  return value === 'light' || value === 'dark' || value === 'system'
}

function applyTheme(theme: BingTheme, persist = true) {
  activeTheme.value = theme
  document.documentElement.dataset.bingTheme = theme

  if (!persist) return

  try {
    localStorage.setItem(themeStorageKey, theme)
  } catch {
    // The selected theme still applies when storage is unavailable.
  }
}

function handleStorage(event: StorageEvent) {
  if (event.key === themeStorageKey && isBingTheme(event.newValue)) {
    applyTheme(event.newValue, false)
  }
}

onMounted(() => {
  const restoredTheme = document.documentElement.dataset.bingTheme ?? null
  activeTheme.value = isBingTheme(restoredTheme) ? restoredTheme : 'light'
  window.addEventListener('storage', handleStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorage)
})
</script>

<template>
  <header class="site-header">
    <NuxtLink class="site-brand" to="/" aria-label="Bing UI 首页">
      <img
        class="site-brand-mark"
        src="/bing-ui-docs-logo.png"
        alt=""
        width="30"
        height="30"
        decoding="async"
      >
      <span>Bing UI</span>
    </NuxtLink>

    <div class="site-header-actions">
      <nav class="site-nav" aria-label="主导航">
        <NuxtLink to="/">首页</NuxtLink>
        <NuxtLink to="/docs">文档</NuxtLink>
        <NuxtLink to="/docs/components/animated-text">组件</NuxtLink>
        <a :href="publicEntries.storybook" target="_blank" rel="noopener noreferrer" title="在 Storybook 中操作组件（新窗口）">演示 ↗</a>
      </nav>

      <div class="site-theme-switch" role="group" aria-label="颜色主题">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          class="site-theme-button"
          :class="{ 'is-active': activeTheme === option.value }"
          type="button"
          :aria-label="`切换为${option.label}主题`"
          :aria-pressed="activeTheme === option.value"
          @click="applyTheme(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </header>
</template>
