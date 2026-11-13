<script setup lang="ts">
import { FilePlus2, FolderOpen, MoreHorizontal, PenLine, Trash2 } from 'lucide-vue-next'
import { BingRadio, BingButton, BingCheckbox, BingCodeBlock, BingDropDown, BingDropDownItem, BingIcon, BingInput, BingRadioGroup } from '@moubing/bing-ui'
import { useExamples } from './state'
const { examplesActive, triggerOptions, placementOptions, sizeOptions, playground, menuOpen, eventLog, minWidthValue, updateTrigger, updatePlacement, updateSize, recordAction, playgroundCode } = useExamples()
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview dropdown-demo-stage">
      <p class="preview-label">菜单预览</p>
      <ClientOnly v-if="examplesActive">
        <BingDropDown
          v-model:open="menuOpen"
          :trigger="playground.trigger"
          :placement="playground.placement"
          :size="playground.size"
          :min-width="minWidthValue"
          :close-on-outside="playground.closeOnOutside"
          :close-on-escape="playground.closeOnEscape"
          :auto-focus="playground.autoFocus"
          :loop="playground.loop"
          :glass="playground.glass"
          ariaLabel="文档操作"
          @open="recordAction('菜单已打开')"
          @close="recordAction('菜单已关闭')"
        >
          <template #trigger="{ triggerProps, open }">
            <BingButton v-bind="triggerProps" variant="secondary" :throttle="false">
              <template #prefix>
                <BingIcon :icon="MoreHorizontal" size="sm" />
              </template>
              {{ open ? '关闭菜单' : '打开菜单' }}
            </BingButton>
          </template>

          <BingDropDownItem
            title="新建页面"
            description="创建一个文档页"
            :icon="FilePlus2"
            shortcut="Ctrl+N"
            @click="recordAction('点击：新建页面')"
          />
          <BingDropDownItem
            title="打开目录"
            description="查看当前组件分组"
            :icon="FolderOpen"
            shortcut="Ctrl+O"
            @click="recordAction('点击：打开目录')"
          />
          <BingDropDownItem
            title="重命名"
            :icon="PenLine"
            shortcut="F2"
            @click="recordAction('点击：重命名')"
          />
          <BingDropDownItem
            title="删除草稿"
            tone="danger"
            :icon="Trash2"
            shortcut="Del"
            @click="recordAction('点击：删除草稿')"
          />
        </BingDropDown>
      </ClientOnly>

      <p class="dropdown-feedback">
        <span>{{ eventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">触发方式</p>
        <BingRadioGroup id="drop-down-control-1" name="drop-down-control-1"
          :model-value="playground.trigger"
          direction="wrap"
          size="sm"
          aria-label="下拉菜单触发方式"
          @update:model-value="updateTrigger">
          <BingRadio v-for="option in triggerOptions" :id="`drop-down-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">弹出位置</p>
        <BingRadioGroup id="drop-down-control-2" name="drop-down-control-2"
          :model-value="playground.placement"
          direction="wrap"
          size="sm"
          aria-label="下拉菜单弹出位置"
          @update:model-value="updatePlacement">
          <BingRadio v-for="option in placementOptions" :id="`drop-down-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">尺寸</p>
        <BingRadioGroup id="drop-down-control-3" name="drop-down-control-3"
          :model-value="playground.size"
          direction="row"
          size="sm"
          aria-label="下拉菜单尺寸"
          @update:model-value="updateSize">
          <BingRadio v-for="option in sizeOptions" :id="`drop-down-control-3-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="dropdown-width">最小宽度</label>
      <BingInput id="dropdown-width" v-model="playground.minWidth" block />

      <div class="inline-control-grid">
        <BingCheckbox v-model="playground.closeOnOutside" label="点击外部关闭" />
        <BingCheckbox v-model="playground.closeOnEscape" label="Esc 关闭" />
        <BingCheckbox v-model="playground.autoFocus" label="打开后聚焦" />
        <BingCheckbox v-model="playground.loop" label="键盘循环" />
        <BingCheckbox v-model="playground.glass" label="玻璃效果" />
      </div>
    </div>
  </div>

  <BingCodeBlock :code="playgroundCode" language="vue" title="代码示例" wrap />
</template>

<style scoped>
.dropdown-demo-stage { justify-items: end; }
</style>
