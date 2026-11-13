<script setup lang="ts">
import { BingRadio, BingButton, BingCheckbox, BingInput, BingRadioGroup, BingSortableList, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { workflowItems, basicOrder, basicDemo, axisOptions, modeOptions, basicEventLog, basicOrderText, updateAxis, updateReorderMode, handleBasicReorder, resetBasicOrder, reverseBasicOrder, toNumberText, basicCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview sortable-demo-stage">
      <p class="preview-label">实时预览</p>
        <BingSortableList
          v-model:order="basicOrder"
          :items="workflowItems"
          :item-key="(item) => item.id"
          :axis="basicDemo.axis"
          :reorder-mode="basicDemo.reorderMode"
          :keyboard="basicDemo.keyboard"
          :flip="basicDemo.flip"
          :disabled="basicDemo.disabled"
          :drag-threshold="toNumberText(basicDemo.dragThreshold)"
          :duration="toNumberText(basicDemo.duration)"
          :settle-duration="toNumberText(basicDemo.settleDuration)"
          ariaLabel="文档流程排序"
          :handleAriaLabel="(item) => `移动 ${item.title}`"
          @reorder="handleBasicReorder"
        >
          <template #default="{ item, handleProps, dragging, disabled }">
            <div class="sortable-card" :class="{ 'is-dragging': dragging, 'is-disabled': disabled }">
              <span v-bind="handleProps" class="sortable-handle" >
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span class="sortable-card__content">
                <strong>{{ item.title }}</strong>
                <small>{{ item.meta }}</small>
              </span>
              <BingTag size="sm" variant="soft" :tone="item.tone">{{ item.id }}</BingTag>
            </div>
          </template>
        </BingSortableList>
      <p class="sortable-feedback">
        <span>当前顺序：{{ basicOrderText }}</span><span>{{ basicEventLog }}</span>
      </p>
      <div class="sortable-action-row">
        <BingButton size="sm" variant="secondary" @click="resetBasicOrder">重置</BingButton>
        <BingButton size="sm" variant="ghost" @click="reverseBasicOrder">反转</BingButton>
      </div>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">方向</p>
        <BingRadioGroup id="sortable-list-control-1" name="sortable-list-control-1"
          :model-value="basicDemo.axis"
          direction="row"
          size="sm"
          ariaLabel="排序方向"
          @update:model-value="updateAxis">
          <BingRadio v-for="option in axisOptions" :id="`sortable-list-control-1-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <div class="control-group">
        <p class="control-label">提交模式</p>
        <BingRadioGroup id="sortable-list-control-2" name="sortable-list-control-2"
          :model-value="basicDemo.reorderMode"
          direction="column"
          size="sm"
          ariaLabel="排序提交模式"
          @update:model-value="updateReorderMode">
          <BingRadio v-for="option in modeOptions" :id="`sortable-list-control-2-${String(option.value)}`" :key="String(option.value)" v-bind="option" />
        </BingRadioGroup>
      </div>

      <label class="control-label" for="sortable-threshold">拖拽激活距离</label>
      <BingInput id="sortable-threshold" v-model="basicDemo.dragThreshold" block />

      <label class="control-label" for="sortable-duration">移动动画时长</label>
      <BingInput id="sortable-duration" v-model="basicDemo.duration" block />

      <label class="control-label" for="sortable-settle-duration">落位动画时长</label>
      <BingInput id="sortable-settle-duration" v-model="basicDemo.settleDuration" block />

      <BingCheckbox v-model="basicDemo.keyboard" label="允许键盘排序" />
      <BingCheckbox v-model="basicDemo.flip" label="开启 FLIP 动画" />
      <BingCheckbox v-model="basicDemo.disabled" label="禁用整个列表" />
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode
    :code="basicCode"
    language="vue"
    title="代码示例"
    max-height="620px"
  />
</template>
