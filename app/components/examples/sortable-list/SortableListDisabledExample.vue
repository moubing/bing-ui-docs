<script setup lang="ts">
import { BingCheckbox, BingSortableList, BingTag } from '@moubing/bing-ui'
import DocsExampleCode from '~/components/DocsExampleCode.vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useExamples } from './state'
const { laneItems, lockedOrder, lockedDemo, disabledItemResolver, disabledKeys, lockedEventLog, lockedOrderText, handleLockedReorder, disabledCode } = useExamples()
const examplesActive = ref(true)
onActivated(() => { examplesActive.value = true })
onDeactivated(() => { examplesActive.value = false })
</script>

<template>
  <ClientOnly v-if="examplesActive">
  <div class="doc-example">
    <div class="doc-example__preview sortable-demo-stage">
      <p class="preview-label">锁定示例</p>
        <BingSortableList
          v-model:order="lockedOrder"
          :items="laneItems"
          :item-key="(item) => item.id"
          :item-disabled="disabledItemResolver"
          :disabled-keys="disabledKeys"
          ariaLabel="文档区块排序" :handleAriaLabel="(item) => `移动 ${item.title}`"
          @reorder="handleLockedReorder"
        >
          <template #default="{ item, handleProps, dragging, disabled }">
            <div
              v-bind="lockedDemo.wholeCardHandle ? handleProps : {}"
              class="sortable-card sortable-card--soft"
              :class="{ 'is-dragging': dragging, 'is-disabled': disabled }"
            >
              <span
                v-if="!lockedDemo.wholeCardHandle"
                v-bind="handleProps"
                class="sortable-handle"

              >
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span class="sortable-card__content">
                <strong>{{ item.title }}</strong>
                <small>{{ item.meta }}</small>
              </span>
              <BingTag size="sm" variant="soft" :tone="disabled ? 'danger' : item.tone">
                {{ disabled ? 'locked' : item.id }}
              </BingTag>
            </div>
          </template>
        </BingSortableList>
      <p class="sortable-feedback">
        <span>当前顺序：{{ lockedOrderText }}</span><span>{{ lockedEventLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <BingCheckbox v-model="lockedDemo.lockByField" label="通过 itemDisabled 读取 locked 字段" />
      <BingCheckbox v-model="lockedDemo.wholeCardHandle" label="整张卡片作为拖拽手柄" />
      <p class="control-help">
        锁定项的手柄会带上 <code>aria-disabled="true"</code> 和 <code>tabindex="-1"</code>，指针拖拽和键盘排序都会被拦截。
      </p>
    </div>
  </div>

  </ClientOnly>
  <DocsExampleCode
    :code="disabledCode"
    language="vue"
    title="代码示例"
    max-height="520px"
  />
</template>
