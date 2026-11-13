<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import messageSource from '~~/examples/form-item/message.vue?raw'
import { renderExampleCode } from '#shared/docs/example-code'
import {
  BingButton,
  BingCheckbox,
  BingCodeBlock,
  BingForm,
  BingFormItem,
  BingInput,
  BingRadioGroup,
  BingSelect,
} from '@moubing/bing-ui'
import type {
  BingFormExpose,
  BingFormLabelPosition,
  BingRadioValue,
  BingSelectModelValue,
} from '@moubing/bing-ui'

type RadioOption<T extends string> = {
  label: string
  value: T
  description?: string
}

const labelPositionOptions: RadioOption<BingFormLabelPosition>[] = [
  { label: 'top', value: 'top', description: '标签在控件上方。' },
  { label: 'left', value: 'left', description: '标签在控件左侧。' },
]

const roleOptions = [
  { label: '设计系统', value: 'design-system' },
  { label: '前端开发', value: 'frontend' },
  { label: '内容运营', value: 'operation' },
]

const fieldFormRef = ref<BingFormExpose | null>(null)
const fieldLog = ref('等待校验')

const fieldSettings = reactive({
  labelPosition: 'left' as BingFormLabelPosition,
  labelWidth: '104',
  required: true,
  showMessage: true,
  disabled: false,
})

const fieldModel = reactive({
  name: '',
  role: null as BingSelectModelValue,
})

const fieldSchema = z.object({
  name: z.string().min(2, '请输入至少 2 个字符'),
  role: z.string({ message: '请选择负责方向' }),
})

const labelWidthValue = computed(() => toCssLength(fieldSettings.labelWidth, '104px'))

const messageCode = computed(() => renderExampleCode(messageSource, {
  ...fieldSettings, labelWidth: labelWidthValue.value,
}))

function updateLabelPosition(value: BingRadioValue) {
  fieldSettings.labelPosition = value as BingFormLabelPosition
}

async function validateFieldForm() {
  const valid = await fieldFormRef.value?.validate()
  fieldLog.value = valid ? '字段表单通过校验' : '字段表单存在错误'
}

function clearFieldErrors() {
  fieldFormRef.value?.clearValidate()
  fieldLog.value = '已清空字段错误'
}

function toCssLength(value: string, fallback: string) {
  const normalized = value.trim()

  if (!normalized) {
    return fallback
  }

  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return `${normalized}px`
  }

  return normalized
}
</script>

<template>
  <div class="doc-example">
    <div class="doc-example__preview form-item-demo-panel">
      <ClientOnly>
        <BingForm
          ref="fieldFormRef"
          :model="fieldModel"
          :schema="fieldSchema"
          :label-position="fieldSettings.labelPosition"
          :label-width="labelWidthValue"
          :disabled="fieldSettings.disabled"
          layout="stack"
        >
          <BingFormItem
            prop="name"
            label="字段名称"
            :required="fieldSettings.required"
            help="帮助文本和错误文本共用同一个消息槽。"
            :show-message="fieldSettings.showMessage"
          >
            <BingInput v-model="fieldModel.name" placeholder="输入后触发校验" block />
          </BingFormItem>

          <BingFormItem
            prop="role"
            label="负责方向"
            :required="fieldSettings.required"
            :show-message="fieldSettings.showMessage"
          >
            <BingSelect
              v-model="fieldModel.role"
              :options="roleOptions"
              placeholder="选择方向"
              block
            />
          </BingFormItem>
        </BingForm>
      </ClientOnly>

      <div class="form-demo-actions">
        <BingButton variant="primary" :throttle="false" @click="validateFieldForm">
          校验字段
        </BingButton>
        <BingButton variant="secondary" :throttle="false" @click="clearFieldErrors">
          清空错误
        </BingButton>
      </div>

      <p class="form-demo-feedback">
        <span>{{ fieldLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="control-group">
        <p class="control-label">标签位置</p>
        <BingRadioGroup
          :model-value="fieldSettings.labelPosition"
          :options="labelPositionOptions"
          direction="row"
          size="sm"
          aria-label="FormItem 标签位置"
          @update:model-value="updateLabelPosition"
        />
      </div>

      <label class="control-label" for="form-item-label-width">标签宽度</label>
      <BingInput id="form-item-label-width" v-model="fieldSettings.labelWidth" block />

      <div class="inline-control-grid">
        <BingCheckbox v-model="fieldSettings.required" label="显示必填星号" />
        <BingCheckbox v-model="fieldSettings.showMessage" label="显示消息区域" />
        <BingCheckbox v-model="fieldSettings.disabled" label="继承禁用状态" />
      </div>
    </div>
  </div>

  <BingCodeBlock :code="messageCode" language="vue" title="代码示例" wrap />
</template>
