<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { BingIcon } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

// 本地图标：属性需要到达实际 SVG，才能应用尺寸、颜色和 ARIA。
const LocalIcon = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h('svg', { ...attrs, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor' }, [h('path', { d: 'M4 12h16M12 4v16' })])
  },
})
const decorative = ref(false)
const label = ref('添加条目')
</script>

<template>
  <BingIcon :icon="LocalIcon" :size="28" tone="success" :stroke-width="2.5" :decorative="decorative" :label="label" />
  <label>名称<input v-model="label" /></label>
  <label><input v-model="decorative" type="checkbox" />装饰</label>
</template>
