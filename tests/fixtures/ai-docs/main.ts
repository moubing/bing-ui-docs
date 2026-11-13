import { createApp, type Component } from 'vue'
import generated from 'virtual:docs-registry'
import Layout from 'virtual:ai-form-layout.vue'
import Methods from 'virtual:ai-form-methods.vue'
import Manual from 'virtual:ai-form-manual.vue'
import NoRequired from 'virtual:ai-form-no-required.vue'
import Understanding from './understanding.vue'
import ItemMessage from 'virtual:ai-form-item-message.vue'
import ItemSpan from 'virtual:ai-form-item-span.vue'
import ItemSlot from 'virtual:ai-form-item-slot.vue'
import ItemHidden from 'virtual:ai-form-item-hidden.vue'
import ItemDisabled from 'virtual:ai-form-item-disabled.vue'
import ItemClamped from 'virtual:ai-form-item-clamped.vue'
import ItemStack from 'virtual:ai-form-item-stack.vue'
import ItemUnderstanding from './form-item-understanding.vue'

const examples = {
  layout: Layout, methods: Methods, manual: Manual, 'no-required': NoRequired, understanding: Understanding,
  'item-message': ItemMessage, 'item-span': ItemSpan, 'item-slot': ItemSlot, 'item-hidden': ItemHidden,
  'item-disabled': ItemDisabled, 'item-clamped': ItemClamped, 'item-stack': ItemStack, 'item-understanding': ItemUnderstanding,
}
const params = new URLSearchParams(location.search)
const name = params.get('example') as keyof typeof examples | null
const understandingCases = import.meta.glob<{ default: Component }>('./*-understanding.vue')
if (params.has('understanding')) {
  const load = understandingCases['./' + params.get('understanding') + '-understanding.vue']
  if (!load) throw new Error('未知理解用例')
  createApp((await load()).default).mount('#app')
} else if (params.has('component')) {
  const load = generated[params.get('component') + '/' + name]
  if (!load) throw new Error('未知导出示例')
  createApp((await load()).default).mount('#app')
} else {
  createApp(examples[name ?? 'layout'] ?? Layout).mount('#app')
}
