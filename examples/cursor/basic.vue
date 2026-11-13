<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue'
import { BingButton, BingCursor, BingInput, type BingCursorType } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const mounted = ref(true)
const count = ref(0)
const text = ref('可正常输入')
const type = ref<BingCursorType>('default')
const visible = ref(false)
const longDocument = ref(false)
onActivated(() => { mounted.value = true })
onDeactivated(() => { mounted.value = false })
</script>

<template>
  <BingCursor v-if="mounted" @change="type = $event" @visibility-change="visible = $event">
    <div class="cursor-basic-zone">
      <div class="row">
        <BingButton @click="count++">点击计数：{{ count }}</BingButton>
        <BingButton disabled>禁用按钮</BingButton>
      </div>
      <BingInput :model-value="text" @update:model-value="text = String($event)" ariaLabel="光标示例输入" block />
      <BingButton :throttle="false" @click="longDocument = !longDocument">{{ longDocument ? '收起长正文' : '展开长正文' }}</BingButton>
      <div class="tile editable" :class="{ 'editable--long': longDocument }" contenteditable="true" role="textbox" aria-label="可编辑正文" aria-multiline="true">
        <p>这里可以直接编辑文字。</p>
        <a href="#overview">移到链接查看手形光标</a>
        <template v-if="longDocument">
          <template v-for="line in 100" :key="line">
            <p>第 {{ line }} 段：滚动时可继续选择、复制和编辑正文。</p>
            <div v-if="line % 5 === 0" contenteditable="false"><button class="image-control" v-bind="{ 'data-bing-cursor': 'zoom-in' }">图片交互区域</button></div>
          </template>
        </template>
      </div>
      <div class="tile" v-bind="{ 'data-bing-cursor': 'grab' }">按住鼠标主键观察抓取状态</div>
      <div class="tile" v-bind="{ 'data-bing-cursor': 'native' }">原生光标区域</div>
    </div>
  </BingCursor>
  <p class="feedback" role="status">光标：{{ type }}；显示：{{ visible ? '是' : '否' }}</p>
</template>

<style scoped>
.cursor-basic-zone { display: grid; gap: 16px; width: 100%; }
.row { display: flex; flex-wrap: wrap; gap: 12px; }
.tile { padding: 20px; border: 1px dashed var(--bing-border); border-radius: 8px; background: var(--bing-surface-soft); }
.editable p { margin: 0 0 8px; }
.editable--long { max-height: 260px; overflow: auto; }
.image-control { width: 240px; max-width: 100%; height: 100px; margin-block: 12px; border: 1px solid var(--bing-border); background: var(--bing-surface-soft); color: var(--bing-text); cursor: zoom-in; }
.editable a { cursor: pointer; color: var(--bing-text); text-decoration: underline; }
.feedback { margin: 16px 0 0; color: var(--bing-text-secondary); font-size: 14px; }
</style>
