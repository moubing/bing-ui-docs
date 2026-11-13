<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { BingButton, BingToast, bingToast, useBingToast, type BingToastItem } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const toast = useBingToast()
const first = ref(true)
const closes = ref(0)
const presentAtClose = ref(false)
const queue = computed(() => JSON.stringify(toast.getToasts()))
function closed(item: BingToastItem) { closes.value++; presentAtClose.value = toast.getToasts().some(value => value.id === item.id) }
function seed() { toast.loading({ id: 7, title: '处理中', message: '原始内容', position: 'bottom-left', closable: false }) }
function replace() { toast.show({ id: '7', message: '替换后' }) }
function positions() {
  toast.success({ id: 'visible', message: '第一个视口可见', position: 'top-left', duration: 0 })
  toast.info({ id: 'hidden', message: '第二个视口等待', position: 'bottom-right', duration: 0 })
}
function startTimer() { toast.show({ id: 'timer-a', message: '定时消息 A', position: 'top-left', duration: 1000 }) }
function updateQueue() { toast.show({ id: 'timer-b', message: '持久消息 B', position: 'top-left', duration: 0 }) }
function defaults() {
  toast.clear()
  toast.show({ id: 'default', message: 'default' })
  toast.success({ id: 'success', message: 'success' })
  toast.fail({ id: 'error', type: 'info', message: 'error' })
  toast.loading({ id: 'loading', message: 'loading' })
  toast.warning({ id: 'warning', message: 'warning' })
  toast.info({ id: 'info', title: '仅标题' })
}
onBeforeUnmount(() => toast.clear())
</script>

<template>
  <div class="controls">
    <BingButton :throttle="false" @click="seed">创建待更新消息</BingButton>
    <BingButton :throttle="false" @click="replace">替换已有消息</BingButton>
    <BingButton :throttle="false" @click="positions">创建两个位置</BingButton>
    <BingButton :throttle="false" @click="first = false">卸载第一个视口</BingButton>
    <BingButton :throttle="false" @click="startTimer">创建定时消息</BingButton>
    <BingButton :throttle="false" @click="updateQueue">更新队列</BingButton>
    <BingButton :throttle="false" @click="defaults">创建默认类型</BingButton>
    <BingButton :throttle="false" @click="toast.clear()">清空</BingButton>
  </div>
  <output id="queue">{{ queue }}</output>
  <p id="closed">{{ closes }} / {{ presentAtClose }}</p>
  <p id="same-service">{{ toast === bingToast }}</p>
  <BingToast v-if="first" viewport-position="top-left" @close="closed" />
  <BingToast viewport-position="all" @close="closed" />
</template>

<style scoped>
.controls { display: flex; gap: 10px; flex-wrap: wrap; max-width: 700px; margin: 280px auto 20px; }
output { display: block; overflow-wrap: anywhere; }
</style>
