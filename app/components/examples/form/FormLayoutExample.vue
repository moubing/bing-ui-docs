<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import layoutSource from '~~/examples/form/layout.vue?raw'
import { renderFormLayoutCode } from '#shared/docs/example-code'
import {
  BingButton,
  BingCheckbox,
  BingCheckboxGroup,
  BingCodeBlock,
  BingForm,
  BingFormItem,
  BingInput,
  BingRadioGroup,
  BingSelect,
  BingTextarea,
} from '@moubing/bing-ui'
import type {
  BingFormErrors,
  BingFormExpose,
  BingFormLabelPosition,
  BingFormLayout,
  BingFormSize,
  BingFormSubmitPayload,
  BingFormValidateTrigger,
  BingRadioValue,
} from '@moubing/bing-ui'

type RadioOption<T extends string> = {
  label: string
  value: T
  description?: string
}

type TriggerFlag = Exclude<BingFormValidateTrigger, 'manual'>

const layoutOptions: RadioOption<BingFormLayout>[] = [
  { label: 'grid', value: 'grid', description: '响应式网格，适合复杂表单。' },
  { label: 'stack', value: 'stack', description: '单列堆叠，适合窄区域。' },
  { label: 'inline', value: 'inline', description: '横向排列，适合筛选栏。' },
]

const labelPositionOptions: RadioOption<BingFormLabelPosition>[] = [
  { label: 'top', value: 'top', description: '标签在控件上方。' },
  { label: 'left', value: 'left', description: '标签在控件左侧。' },
]

const sizeOptions: RadioOption<BingFormSize>[] = [
  { label: 'sm', value: 'sm' },
  { label: 'md', value: 'md' },
  { label: 'lg', value: 'lg' },
]

const roleOptions = [
  { label: '设计系统', value: 'design-system', description: '组件规范、主题和交互标准。' },
  { label: '前端开发', value: 'frontend', description: '页面开发和组件接入。' },
  { label: '产品运营', value: 'operation', description: '内容配置和上线计划。' },
]

const channelOptions = [
  { label: '站内消息', value: 'inbox' },
  { label: '邮件通知', value: 'email' },
  { label: '飞书提醒', value: 'lark' },
]

const densityOptions = [
  { label: '紧凑', value: 'compact', description: '更适合后台筛选栏。' },
  { label: '舒展', value: 'comfortable', description: '更适合编辑表单。' },
]

const formRef = ref<BingFormExpose | null>(null)
const submitLog = ref('等待提交')

const formSettings = reactive({
  layout: 'grid' as BingFormLayout,
  labelPosition: 'top' as BingFormLabelPosition,
  labelWidth: '112',
  size: 'md' as BingFormSize,
  columnsBase: '1',
  columnsSm: '2',
  columnsXl: '3',
  rowGap: '14',
  columnGap: '18',
  disabled: false,
  scrollToError: true,
  focusOnError: true,
  validateAuto: true,
  validateOnChange: false,
  validateOnBlur: false,
  validateOnSubmit: false,
})

const formModel = reactive({
  name: '',
  role: null as string | null,
  channels: ['inbox'] as string[],
  density: 'comfortable',
  description: '',
})

const formSchema = z.object({
  name: z.string().min(2, '请输入至少 2 个字符的项目名称'),
  role: z.string({ message: '请选择负责方向' }),
  channels: z.array(z.string()).min(1, '至少选择一个通知渠道'),
  density: z.string(),
  description: z.string().max(120, '描述不能超过 120 个字符'),
})

const columnsValue = computed(() => ({
  base: toPositiveNumber(formSettings.columnsBase, 1),
  sm: toPositiveNumber(formSettings.columnsSm, 2),
  xl: toPositiveNumber(formSettings.columnsXl, 3),
}))

const gapValue = computed(() => ({
  row: toCssLength(formSettings.rowGap, '14px'),
  column: toCssLength(formSettings.columnGap, '18px'),
}))

const labelWidthValue = computed(() => toCssLength(formSettings.labelWidth, '112px'))

const validateTriggers = computed<BingFormValidateTrigger[]>(() => {
  const triggers: TriggerFlag[] = []

  if (formSettings.validateAuto) triggers.push('auto')

  if (formSettings.validateOnChange) {
    triggers.push('change')
  }

  if (formSettings.validateOnBlur) {
    triggers.push('blur')
  }

  if (formSettings.validateOnSubmit) {
    triggers.push('submit')
  }

  return triggers.length > 0 ? triggers : ['manual']
})

const layoutCode = computed(() => renderFormLayoutCode(layoutSource, {
  layout: formSettings.layout,
  labelPosition: formSettings.labelPosition,
  labelWidth: labelWidthValue.value,
  size: formSettings.size,
  columns: columnsValue.value,
  gap: gapValue.value,
  validateTrigger: validateTriggers.value,
  disabled: formSettings.disabled,
  scrollToError: formSettings.scrollToError,
  focusOnError: formSettings.focusOnError,
}))

function updateLayout(value: BingRadioValue) {
  formSettings.layout = value as BingFormLayout
}

function updateLabelPosition(value: BingRadioValue) {
  formSettings.labelPosition = value as BingFormLabelPosition
}

function updateSize(value: BingRadioValue) {
  formSettings.size = value as BingFormSize
}

function handleSubmit(payload: BingFormSubmitPayload) {
  submitLog.value = payload.valid
    ? '提交成功：表单数据通过校验'
    : `提交失败：${formatErrorCount(payload.errors)}`
}

function handleInvalid(payload: { errors: BingFormErrors }) {
  submitLog.value = `invalid 事件：${formatErrorCount(payload.errors)}`
}

function toPositiveNumber(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
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

function formatErrorCount(errors: BingFormErrors) {
  const count = Object.values(errors).reduce((total, messages) => total + messages.length, 0)

  return `${count} 条错误`
}
</script>

<template>
  <div class="doc-example doc-example--stacked">
    <div class="doc-example__preview form-demo-panel">
      <ClientOnly>
        <BingForm
          ref="formRef"
          :model="formModel"
          :schema="formSchema"
          :layout="formSettings.layout"
          :label-position="formSettings.labelPosition"
          :label-width="labelWidthValue"
          :size="formSettings.size"
          :columns="columnsValue"
          :gap="gapValue"
          :disabled="formSettings.disabled"
          :validate-trigger="validateTriggers"
          :scroll-to-error="formSettings.scrollToError"
          :focus-on-error="formSettings.focusOnError"
          @submit="handleSubmit"
          @invalid="handleInvalid"
        >
          <BingFormItem prop="name" label="项目名称" required>
            <BingInput :model-value="formModel.name" @update:model-value="formModel.name = String($event)" placeholder="例如：组件文档站" block />
          </BingFormItem>

          <BingFormItem prop="role" label="负责方向" required>
            <BingSelect
              v-model="formModel.role"
              :options="roleOptions"
              placeholder="选择方向"
              block
            />
          </BingFormItem>

          <BingFormItem prop="channels" label="通知渠道" :span="{ sm: 2, xl: 2 }" required>
            <BingCheckboxGroup v-model="formModel.channels" :options="channelOptions" />
          </BingFormItem>

          <BingFormItem prop="density" label="表单密度">
            <BingRadioGroup
              v-model="formModel.density"
              :options="densityOptions"
              direction="row"
              aria-label="表单密度"
            />
          </BingFormItem>

          <BingFormItem
            prop="description"
            label="说明"
            :span="{ sm: 2, xl: 3 }"
            help="最多 120 个字符"
          >
            <BingTextarea
              v-model="formModel.description"
              autosize
              show-count
              :max-length="120"
              placeholder="补充交付范围、验收点或备注"
            />
          </BingFormItem>

          <BingFormItem :span="{ sm: 2, xl: 3 }">
            <div class="form-demo-actions">
              <BingButton html-type="submit" variant="primary" :throttle="false">
                提交
              </BingButton>
              <BingButton variant="secondary" :throttle="false" @click="formRef?.clearValidate()">
                清空校验
              </BingButton>
            </div>
          </BingFormItem>
        </BingForm>
      </ClientOnly>

      <p class="form-demo-feedback">
        <span>{{ submitLog }}</span>
      </p>
    </div>

    <div class="doc-example__controls">
      <div class="form-demo-controls-grid">
        <div class="control-group">
          <p class="control-label">布局</p>
          <BingRadioGroup
            :model-value="formSettings.layout"
            :options="layoutOptions"
            direction="row"
            size="sm"
            aria-label="表单布局"
            @update:model-value="updateLayout"
          />
        </div>

        <div class="control-group">
          <p class="control-label">标签位置</p>
          <BingRadioGroup
            :model-value="formSettings.labelPosition"
            :options="labelPositionOptions"
            direction="row"
            size="sm"
            aria-label="标签位置"
            @update:model-value="updateLabelPosition"
          />
        </div>

        <div class="control-group">
          <p class="control-label">尺寸</p>
          <BingRadioGroup
            :model-value="formSettings.size"
            :options="sizeOptions"
            direction="row"
            size="sm"
            aria-label="表单尺寸"
            @update:model-value="updateSize"
          />
        </div>
      </div>

      <div class="inline-control-grid">
        <BingCheckbox v-model="formSettings.validateAuto" label="auto 校验" />
        <label class="control-label" for="form-label-width">标签宽度</label>
        <BingInput id="form-label-width" v-model="formSettings.labelWidth" block />
        <label class="control-label" for="form-columns-sm">sm 列数</label>
        <BingInput id="form-columns-sm" v-model="formSettings.columnsSm" block />
        <label class="control-label" for="form-columns-xl">xl 列数</label>
        <BingInput id="form-columns-xl" v-model="formSettings.columnsXl" block />
        <label class="control-label" for="form-row-gap">行间距</label>
        <BingInput id="form-row-gap" v-model="formSettings.rowGap" block />
        <label class="control-label" for="form-column-gap">列间距</label>
        <BingInput id="form-column-gap" v-model="formSettings.columnGap" block />
      </div>

      <div class="inline-control-grid">
        <BingCheckbox v-model="formSettings.validateOnChange" label="change 校验" />
        <BingCheckbox v-model="formSettings.validateOnBlur" label="blur 校验" />
        <BingCheckbox v-model="formSettings.validateOnSubmit" label="submit 校验" />
        <BingCheckbox v-model="formSettings.scrollToError" label="滚动到错误" />
        <BingCheckbox v-model="formSettings.focusOnError" label="聚焦错误字段" />
        <BingCheckbox v-model="formSettings.disabled" label="禁用表单" />
      </div>
    </div>
  </div>

  <BingCodeBlock :code="layoutCode" language="vue" title="代码示例" wrap />
</template>
