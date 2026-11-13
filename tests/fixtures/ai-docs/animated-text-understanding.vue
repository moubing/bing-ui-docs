<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { BingAnimatedText, type BingAnimatedTextProps } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const text = ref('你好👨‍👩‍👧‍👦')
const keyed = ref(false)
const mounted = ref(true)
const props = reactive<BingAnimatedTextProps>({ effect: 'jump', trigger: 'always', jumpY: -12, jumpDuration: 0.2, jumpStagger: 0.03, jumpRepeatDelay: 0.05 })
const identity = computed(() => keyed.value ? JSON.stringify([text.value, props]) : 'stable')
</script>

<template>
  <label>文案<input v-model="text" aria-label="阅读文案"></label>
  <label><input id="disabled" v-model="props.disabled" type="checkbox">禁用动画</label>
  <label><input id="keyed" v-model="keyed" type="checkbox">变化时重建</label>
  <label><input id="mounted" v-model="mounted" type="checkbox">挂载示例</label>
  <button id="none" type="button" @click="props.effect = 'none'">普通文本</button>
  <button id="once" type="button" @click="props.trigger = 'once'">只播放一次</button>
  <button id="shine" type="button" @click="props.effect = 'shine'; props.trigger = 'hover'; props.shineDelay = 0.3; props.shineSpeed = 0.1">延迟扫光</button>
  <p id="preview" style="font-size: 36px"><BingAnimatedText v-if="mounted" :key="identity" v-bind="props">{{ text }}</BingAnimatedText></p>
</template>
