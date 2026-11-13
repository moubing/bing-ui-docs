<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { BingButton, BingCheckbox, BingToast, bingToast, type BingToastAction } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const status = ref('测试中')
const failNext = ref(true)
const log = ref('等待操作')
const timers = new Set<ReturnType<typeof setTimeout>>()

function wait(ms: number) {
  return new Promise<void>(resolve => {
    const timer = setTimeout(() => { timers.delete(timer); resolve() }, ms)
    timers.add(timer)
  })
}

function finish() {
  if (status.value === '已完成') return
  const previous = status.value
  status.value = '已完成'
  log.value = '已完成，可在提示中撤销'
  const action: BingToastAction = {
    label: '撤销',
    ariaLabel: '撤销 REQ-26 的状态修改',
    // 返回 Promise：处理中显示加载并暂停计时；兑现后关闭提示，拒绝时保留提示供重试。
    async onClick() {
      await wait(150)
      if (!bingToast.getToasts().some(toast => toast.id === 'toast-action-demo')) return
      // 复用同一个 action 更新文字，按钮继续加载，不能重复提交。
      show('REQ-26 已改为已完成，正在撤销…')
      await wait(450)
      if (failNext.value) {
        failNext.value = false
        log.value = '撤销失败，提示仍保留，可以再试一次'
        if (bingToast.getToasts().some(toast => toast.id === 'toast-action-demo')) show('REQ-26 已改为已完成')
        bingToast.error({ id: 'toast-action-demo-error', message: '撤销失败：状态已被他人修改', position: 'bottom' })
        throw new Error('conflict')
      }
      status.value = previous
      log.value = '已撤销，恢复为' + previous
    },
  }
  function show(message: string) {
    bingToast.success({ id: 'toast-action-demo', message, position: 'bottom', action })
  }
  show('REQ-26 已改为已完成')
}

onBeforeUnmount(() => {
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
  bingToast.close('toast-action-demo')
  bingToast.close('toast-action-demo-error')
})
</script>

<template>
  <div class="action-example">
    <p class="action-status">REQ-26：<strong>{{ status }}</strong></p>
    <div class="action-row">
      <BingButton :disabled="status === '已完成'" :throttle="false" @click="finish">标记完成</BingButton>
      <BingCheckbox v-model="failNext" label="下一次撤销失败" />
    </div>
    <p role="status">{{ log }}</p>
  </div>
  <BingToast viewport-position="all" />
</template>

<style scoped>
.action-example { display: grid; gap: 12px; }
.action-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.action-status, p { margin: 0; color: var(--bing-text); }
p[role=status] { color: var(--bing-muted); font-size: 13px; }
</style>
