<script setup lang="ts">
import { Copy, Tag, Trash2, Upload } from 'lucide-vue-next'
import { BingButton, BingCodeBlock, BingDropDown, BingDropDownItem } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, controlledOpen, controlledLog, controlledDropdown, recordControlled, openControlled, closeControlled, toggleControlled, focusControlled, controlledCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dropdown-demo-stage">
      <p class="preview-label">受控面板</p>
      <div class="dropdown-action-row" @pointerdown.stop>
        <BingButton variant="secondary" size="sm" :throttle="false" @click="openControlled">
          打开
        </BingButton>
        <BingButton variant="secondary" size="sm" :throttle="false" @click="closeControlled">
          关闭
        </BingButton>
        <BingButton variant="secondary" size="sm" :throttle="false" @click="toggleControlled">
          切换
        </BingButton>
        <BingButton variant="secondary" size="sm" :throttle="false" @click="focusControlled">
          聚焦第一项
        </BingButton>
      </div>

      <ClientOnly v-if="examplesActive">
        <BingDropDown
          ref="controlledDropdown"
          v-model:open="controlledOpen"
          min-width="260px"
          placement="bottom-start"
          auto-focus
          ariaLabel="受控菜单"
          @open="recordControlled('事件：open')"
          @close="recordControlled('事件：close')"
        >
          <template #trigger="{ triggerProps }">
            <BingButton v-bind="triggerProps" variant="primary" :throttle="false">
              更多发布操作
            </BingButton>
          </template>

          <BingDropDownItem title="发布当前版本" tone="success" :icon="Upload" shortcut="Ctrl+Enter" />
          <BingDropDownItem title="生成变更记录" :icon="Tag" />
          <BingDropDownItem title="复制 npm 命令" :icon="Copy" />
          <BingDropDownItem title="删除草稿" tone="danger" :icon="Trash2" />
        </BingDropDown>
      </ClientOnly>

      <p class="dropdown-feedback">
        <span>{{ controlledLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <p>
        受控模式下组件不会自己改内部状态，而是通过 <code>update:open</code>通知外部更新。方法调用和触发器点击最终都会落到同一套状态上。
      </p>
    </div>
  </div>

  <BingCodeBlock :code="controlledCode" language="vue" title="代码示例" wrap />
</template>
