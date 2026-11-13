<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { BingCodeBlock } from '@moubing/bing-ui'

type DocsCodeGroupItem = {
  value: string
  label: string
  code: string
  language?: string
  title?: string
}

const props = withDefaults(
  defineProps<{
    items: DocsCodeGroupItem[]
    defaultValue?: string
    ariaLabel?: string
  }>(),
  {
    defaultValue: undefined,
    ariaLabel: '代码示例',
  },
)

const emit = defineEmits<{
  change: [value: string]
}>()

const instanceId = `docs-code-group-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
const activeValue = ref(resolveInitialValue())

const activeIndex = computed(() => {
  const index = props.items.findIndex(item => item.value === activeValue.value)
  return index >= 0 ? index : 0
})

const activeItem = computed(() => props.items[activeIndex.value])

watch(
  () => props.items.map(item => item.value),
  () => {
    if (!props.items.some(item => item.value === activeValue.value)) {
      activeValue.value = resolveInitialValue()
    }
  },
)

function resolveInitialValue() {
  if (props.defaultValue && props.items.some(item => item.value === props.defaultValue)) {
    return props.defaultValue
  }

  return props.items[0]?.value ?? ''
}

function selectTab(index: number, focus = false) {
  const item = props.items[index]

  if (!item) {
    return
  }

  activeValue.value = item.value
  emit('change', item.value)

  if (focus) {
    document.getElementById(tabId(index))?.focus()
  }
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const lastIndex = props.items.length - 1
  let nextIndex = index

  if (event.key === 'ArrowRight') {
    nextIndex = index === lastIndex ? 0 : index + 1
  } else if (event.key === 'ArrowLeft') {
    nextIndex = index === 0 ? lastIndex : index - 1
  } else if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = lastIndex
  } else {
    return
  }

  event.preventDefault()
  selectTab(nextIndex, true)
}

function tabId(index: number) {
  return `${instanceId}-tab-${index}`
}

function panelId(index: number) {
  return `${instanceId}-panel-${index}`
}
</script>

<template>
  <div v-if="activeItem" class="docs-code-group">
    <div class="docs-code-group__tabs" role="tablist" :aria-label="ariaLabel">
      <button
        v-for="(item, index) in items"
        :id="tabId(index)"
        :key="item.value"
        class="docs-code-group__tab"
        :class="{ 'is-active': index === activeIndex }"
        type="button"
        role="tab"
        :aria-selected="index === activeIndex"
        :aria-controls="panelId(index)"
        :tabindex="index === activeIndex ? 0 : -1"
        @click="selectTab(index)"
        @keydown="handleKeydown($event, index)"
      >
        {{ item.label }}
      </button>
    </div>

    <div
      :id="panelId(activeIndex)"
      class="docs-code-group__panel"
      role="tabpanel"
      :aria-labelledby="tabId(activeIndex)"
    >
      <BingCodeBlock
        :code="activeItem.code"
        :language="activeItem.language || 'text'"
        :title="activeItem.title"
      />
    </div>
  </div>
</template>

<style scoped>
.docs-code-group {
  overflow: hidden;
  border: 1px solid var(--line, #d9e1ec);
  border-radius: 8px;
  background: var(--surface, #ffffff);
}

.docs-code-group__tabs {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  border-bottom: 1px solid var(--line, #d9e1ec);
  background: color-mix(in srgb, var(--surface-muted, #eef3f8) 62%, transparent);
  padding: 0.45rem 0.55rem 0;
  scrollbar-width: none;
}

.docs-code-group__tabs::-webkit-scrollbar {
  display: none;
}

.docs-code-group__tab {
  position: relative;
  flex: 0 0 auto;
  min-height: 36px;
  border: 0;
  border-radius: 7px 7px 0 0;
  background: transparent;
  padding: 0 0.8rem 0.45rem;
  color: var(--muted, #657188);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.docs-code-group__tab::after {
  position: absolute;
  right: 0.7rem;
  bottom: 0;
  left: 0.7rem;
  height: 2px;
  border-radius: 999px 999px 0 0;
  background: var(--blue, #1f6feb);
  content: "";
  opacity: 0;
  transform: scaleX(0.5);
  transition:
    opacity 160ms ease,
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.docs-code-group__tab:hover,
.docs-code-group__tab.is-active {
  color: var(--ink, #172033);
}

.docs-code-group__tab.is-active::after {
  opacity: 1;
  transform: scaleX(1);
}

.docs-code-group__tab:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--blue, #1f6feb) 36%, transparent);
  outline-offset: -2px;
}

.docs-code-group__panel :deep(.bing-code-block) {
  border: 0;
  border-radius: 0;
}

@media (prefers-reduced-motion: reduce) {
  .docs-code-group__tab::after {
    transition: none;
  }
}
</style>
