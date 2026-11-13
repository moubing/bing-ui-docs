<script setup lang="ts">
import { onBeforeUnmount, onDeactivated, ref } from 'vue'
import { BingButton, BingCheckbox, BingCodeBlock, bingToast, type BingToastAction } from '@moubing/bing-ui'
import codeSource from '~~/examples/toast/action.vue?raw'

// 与独立示例逻辑一致，但复用文档页唯一的视口，不另挂 BingToast。
const code = codeSource.trim()
const status = ref('测试中')
const failNext = ref(true)
const log = ref('等待操作')
const timers = new Set<number>()

function wait(ms: number) {
  return new Promise<void>(resolve => {
    const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, ms)
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
    async onClick() {
      await wait(150)
      if (!bingToast.getToasts().some(toast => toast.id === 'docs-toast-action')) return
      show('REQ-26 已改为已完成，正在撤销…')
      await wait(450)
      if (failNext.value) {
        failNext.value = false
        log.value = '撤销失败，提示仍保留，可以再试一次'
        if (bingToast.getToasts().some(toast => toast.id === 'docs-toast-action')) show('REQ-26 已改为已完成')
        bingToast.error({ id: 'docs-toast-action-error', message: '撤销失败：状态已被他人修改', position: 'bottom' })
        throw new Error('conflict')
      }
      status.value = previous
      log.value = '已撤销，恢复为' + previous
    },
  }
  function show(message: string) {
    bingToast.success({ id: 'docs-toast-action', message, position: 'bottom', action })
  }
  show('REQ-26 已改为已完成')
}

function cleanup() {
  timers.forEach(timer => window.clearTimeout(timer))
  timers.clear()
  bingToast.close('docs-toast-action')
  bingToast.close('docs-toast-action-error')
}
onBeforeUnmount(cleanup)
onDeactivated(cleanup)
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview toast-demo-stage">
      <div class="toast-action-demo">
        <p>REQ-26：<strong>{{ status }}</strong></p>
        <div class="toast-action-row">
          <BingButton :disabled="status === '已完成'" :throttle="false" @click="finish">标记完成</BingButton>
          <BingCheckbox v-model="failNext" label="下一次撤销失败" />
        </div>
        <p role="status" class="toast-action-log">{{ log }}</p>
      </div>
    </div>

    <div class="doc-example__controls">
      <p>
        撤销按钮返回 Promise，并复用同一 action 更新进度文字。处理中保持加载、提示暂停计时；勾选“下一次撤销失败”时提示保留，可以再点一次。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="code" language="vue" title="代码示例" wrap />
</template>

<style scoped>
.toast-action-demo { display: grid; gap: 12px; }
.toast-action-demo p { margin: 0; }
.toast-action-log { color: var(--bing-muted); font-size: 13px; }
</style>
