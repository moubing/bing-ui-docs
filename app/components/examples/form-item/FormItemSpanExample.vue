<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import spanSource from '~~/examples/form-item/span.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import { BingButton, BingCodeBlock, BingForm, BingFormItem, BingInput, BingRadioGroup, BingSelect, BingTextarea } from '@moubing/bing-ui'
import type { BingFormExpose, BingRadioValue, BingSelectModelValue } from '@moubing/bing-ui'

type RadioOption<T extends string> = {
  label: string
  value: T
  description?: string
}

type SpanMode = 'single' | 'wide' | 'full'

const spanOptions: RadioOption<SpanMode>[] = [
  { label: 'single', value: 'single', description: '占 1 列。' },
  { label: 'wide', value: 'wide', description: '在 sm 以上占 2 列。' },
  { label: 'full', value: 'full', description: '在 xl 下占满 3 列。' },
]

const roleOptions = [
  { label: '设计系统', value: 'design-system' },
  { label: '前端开发', value: 'frontend' },
  { label: '内容运营', value: 'operation' },
]

const spanFormRef = ref<BingFormExpose | null>(null)
const spanLog = ref('调整 span 后观察布局')

const spanModel = reactive({
  title: '',
  owner: '',
  type: null as BingSelectModelValue,
  notes: '',
})

const spanSettings = reactive({
  titleSpan: 'single' as SpanMode,
  notesSpan: 'full' as SpanMode,
})

const spanSchema = z.object({
  title: z.string().min(1, '请输入标题'),
  owner: z.string().min(1, '请输入负责人'),
  type: z.string({ message: '请选择类型' }),
  notes: z.string().max(120, '备注不能超过 120 个字符'),
})

const titleSpanValue = computed(() => resolveSpan(spanSettings.titleSpan))
const notesSpanValue = computed(() => resolveSpan(spanSettings.notesSpan))

const spanCode = computed(() => renderExampleCode(spanSource, {
  titleSpan: titleSpanValue.value, notesSpan: notesSpanValue.value,
}))

function updateTitleSpan(value: BingRadioValue) {
  spanSettings.titleSpan = value as SpanMode
}

function updateNotesSpan(value: BingRadioValue) {
  spanSettings.notesSpan = value as SpanMode
}

async function validateSpanForm() {
  const valid = await spanFormRef.value?.validate()
  spanLog.value = valid ? '布局表单通过校验' : '布局表单存在错误'
}

function resolveSpan(mode: SpanMode) {
  if (mode === 'full') {
    return {
      sm: 2,
      xl: 3,
    }
  }

  if (mode === 'wide') {
    return {
      sm: 2,
      xl: 2,
    }
  }

  return 1
}

</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview form-item-demo-panel">
      <ClientOnly>
        <BingForm
          ref="spanFormRef"
          :model="spanModel"
          :schema="spanSchema"
          :columns="{ base: 1, sm: 2, xl: 3 }"
          :gap="{ row: 14, column: 18 }"
        >
          <BingFormItem prop="title" label="标题" :span="titleSpanValue" required>
            <BingInput v-model="spanModel.title" placeholder="例如：新增组件文档" block />
          </BingFormItem>

          <BingFormItem prop="owner" label="负责人" required>
            <BingInput v-model="spanModel.owner" placeholder="输入负责人" block />
          </BingFormItem>

          <BingFormItem prop="type" label="类型" required>
            <BingSelect
              v-model="spanModel.type"
              :options="roleOptions"
              placeholder="选择类型"
              block
            />
          </BingFormItem>

          <BingFormItem prop="notes" label="备注" :span="notesSpanValue" help="span 变化会影响字段占列。">
            <BingTextarea v-model="spanModel.notes" autosize show-count :max-length="120" />
          </BingFormItem>
        </BingForm>
      </ClientOnly>

      <div class="form-demo-actions">
        <BingButton variant="primary" :throttle="false" @click="validateSpanForm">
          校验布局表单
        </BingButton>
      </div>

      <p class="form-demo-feedback">
        <span>{{ spanLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">标题 span</p>
        <BingRadioGroup
          :model-value="spanSettings.titleSpan"
          :options="spanOptions"
          direction="wrap"
          size="sm"
          aria-label="标题字段跨度"
          @update:model-value="updateTitleSpan"
        />
      </div>

      <div class="control-group">
        <p class="control-label">备注 span</p>
        <BingRadioGroup
          :model-value="spanSettings.notesSpan"
          :options="spanOptions"
          direction="wrap"
          size="sm"
          aria-label="备注字段跨度"
          @update:model-value="updateNotesSpan"
        />
      </div>
    </div>
  </div>

  <BingCodeBlock :code="spanCode" language="vue" title="代码示例" wrap />
</template>
