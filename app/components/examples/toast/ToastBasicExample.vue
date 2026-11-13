<script setup lang="ts">
import { BingButton, BingCheckbox, BingCodeBlock, BingInput, BingSelect } from '@moubing/bing-ui'
import DocsToastViewport from '~/components/content/DocsToastViewport.vue'
import { useExamples } from './state'
const { typeOptions, positionOptions, viewportOptions, playgroundType, playgroundPosition, playgroundViewport, playgroundTitle, playgroundMessage, playgroundDuration, playgroundClosable, playgroundWidth, playgroundOffset, playgroundGap, playgroundMax, lastToastId, closeLog, playgroundSummary, updateType, updatePosition, updateViewport, pushConfiguredToast, pushType, pushLoadingFlow, pushStack, closeLastToast, clearAllToasts, clearCurrentPosition, handleClose, serviceMethodName, resolveMax, playgroundCode } = useExamples()
</script>

<template>
  <ClientOnly>
  <DocsToastViewport
    :viewport-position="playgroundViewport"
    :width="playgroundWidth"
    :offset="playgroundOffset"
    :gap="playgroundGap"
    :max="resolveMax()"
    @close="handleClose"
  />
      </ClientOnly>

  <div class="doc-example doc-example--wide toast-playground">
    <div class="doc-example__preview toast-demo-stage toast-playground__stage">
      <div class="toast-playground__heading">
        <div>
          <p class="preview-label">当前调用</p>
          <p class="toast-playground__hint">修改右侧配置，这张调用卡会同步更新。</p>
        </div>
        <span class="toast-type-chip" :class="`is-${playgroundType}`">{{ playgroundType }}</span>
      </div>

      <div class="toast-recipe-card" :class="`is-${playgroundType}`">
        <div class="toast-recipe-card__meta">
          <code>bingToast.{{ serviceMethodName(playgroundType) }}()</code>
          <span>{{ playgroundPosition }}</span>
        </div>
        <strong>{{ playgroundTitle || '未设置标题' }}</strong>
        <p>{{ playgroundMessage || '未设置消息内容' }}</p>
      </div>

      <dl class="toast-summary-grid">
        <div v-for="item in playgroundSummary" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>

      <div class="toast-playground__group">
        <div class="toast-playground__group-heading">
          <p class="preview-label">快速验证</p>
          <span>无需改动当前配置</span>
        </div>
        <div class="toast-quick-grid">
          <BingButton variant="secondary" :throttle="false" @click="pushType('success')">
            success
          </BingButton>
          <BingButton variant="secondary" :throttle="false" @click="pushType('error')">
            error
          </BingButton>
          <BingButton variant="tertiary" :throttle="false" @click="pushLoadingFlow">
            loading → success
          </BingButton>
          <BingButton variant="tertiary" :throttle="false" @click="pushStack">
            堆叠 3 条
          </BingButton>
        </div>
      </div>

      <div class="toast-playground__group">
        <p class="preview-label">队列操作</p>
        <div class="toast-action-row">
          <BingButton :throttle="false" @click="pushConfiguredToast">创建当前提示</BingButton>
          <BingButton variant="secondary" :throttle="false" @click="closeLastToast">关闭上一条</BingButton>
          <BingButton variant="ghost" :throttle="false" @click="clearCurrentPosition">清空当前位置</BingButton>
          <BingButton variant="ghost" :throttle="false" @click="clearAllToasts">清空全部</BingButton>
        </div>
      </div>

      <div class="toast-feedback" aria-live="polite">
        <span><small>最后 id</small><strong>{{ lastToastId }}</strong></span>
        <span><small>队列反馈</small><strong>{{ closeLog }}</strong></span>
      </div>
    </div>

    <div class="doc-example__controls toast-playground__controls">
      <div class="toast-control-section">
        <div class="toast-control-section__heading">
          <span>消息内容</span>
          <small>Toast 实际呈现的标题和正文</small>
        </div>
        <div class="toast-field-grid">
          <div class="toast-control-field toast-control-field--wide">
            <label class="control-label" for="toast-title">标题</label>
            <BingInput id="toast-title" v-model="playgroundTitle" block clearable />
          </div>
          <div class="toast-control-field toast-control-field--wide">
            <label class="control-label" for="toast-message">内容</label>
            <BingInput id="toast-message" v-model="playgroundMessage" block clearable />
          </div>
        </div>
      </div>

      <div class="toast-control-section">
        <div class="toast-control-section__heading">
          <span>布局与节奏</span>
          <small>控制尺寸、边距和堆叠密度</small>
        </div>
        <div class="toast-field-grid">
          <div class="toast-control-field">
            <label class="control-label" for="toast-duration">持续时间 ms</label>
            <BingInput id="toast-duration" v-model="playgroundDuration" block />
          </div>
          <div class="toast-control-field">
            <label class="control-label" for="toast-width">宽度</label>
            <BingInput id="toast-width" v-model="playgroundWidth" block />
          </div>
          <div class="toast-control-field">
            <label class="control-label" for="toast-offset">边距</label>
            <BingInput id="toast-offset" v-model="playgroundOffset" block />
          </div>
          <div class="toast-control-field">
            <label class="control-label" for="toast-gap">间距</label>
            <BingInput id="toast-gap" v-model="playgroundGap" block />
          </div>
          <div class="toast-control-field toast-control-field--wide">
            <label class="control-label" for="toast-max">视觉深度 max</label>
            <BingInput id="toast-max" v-model="playgroundMax" block />
          </div>
        </div>
      </div>

      <div class="toast-control-section">
        <div class="toast-control-section__heading">
          <span>行为规则</span>
          <small>选择消息语义以及渲染区域</small>
        </div>
        <div class="toast-field-grid">
          <div class="toast-control-field">
            <span class="control-label">消息类型</span>
            <BingSelect
              :model-value="playgroundType"
              :options="typeOptions"
              :clearable="false"
              block
              aria-label="选择 Toast 消息类型"
              @update:model-value="updateType"
            />
          </div>

          <div class="toast-control-field">
            <span class="control-label">消息位置</span>
            <BingSelect
              :model-value="playgroundPosition"
              :options="positionOptions"
              :clearable="false"
              block
              aria-label="选择 Toast 消息位置"
              @update:model-value="updatePosition"
            />
          </div>

          <div class="toast-control-field toast-control-field--wide">
            <span class="control-label">视口位置</span>
            <BingSelect
              :model-value="playgroundViewport"
              :options="viewportOptions"
              :clearable="false"
              :panel-max-height="300"
              block
              aria-label="选择 Toast 视口位置"
              @update:model-value="updateViewport"
            />
          </div>
        </div>

        <BingCheckbox v-model="playgroundClosable" label="显示关闭按钮" />
      </div>
    </div>
  </div>

  <BingCodeBlock :code="playgroundCode" language="vue" title="代码示例" wrap />
</template>
