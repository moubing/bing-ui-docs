<script setup lang="ts">
import { ref } from 'vue'
import {
  BingCheckbox, BingDragDrop, BingDraggable, BingDropZone,
  type BingDragDropDropPayload, type BingDragDropEndPayload, type BingDragDropItem, type BingDragDropOverPayload,
} from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type Task = { id: string; title: string; zone: 'testing' | 'doing' | 'done'; locked?: boolean }

const tasks = ref<Task[]>([
  { id: 'REQ-3', title: '版本对比支持表格', zone: 'testing' },
  { id: 'REQ-7', title: '发布说明定稿', zone: 'testing', locked: true },
  { id: 'BUG-4', title: '粘贴图片偶发丢失', zone: 'doing' },
])
const notes = ref<Record<string, string>>({})
const dropOnSource = ref(false)
const events = ref<string[]>([])

function record(text: string) {
  events.value = [...events.value, text].slice(-5)
}
// 源区域总是接受自己的条目；其他区域由 accept 决定。
const onlyFromTesting = (item: BingDragDropItem) => item.zone === 'testing'

function handleOver(payload: BingDragDropOverPayload) {
  record(`over ${payload.over ?? '区域外'}`)
}
function handleDrop(payload: BingDragDropDropPayload) {
  record(`drop ${payload.id}：${payload.from} → ${payload.to}`)
  if (payload.to === 'trash') {
    tasks.value = tasks.value.filter(task => task.id !== payload.id)
    return
  }
  const task = tasks.value.find(item => item.id === payload.id)
  if (task) task.zone = payload.to as Task['zone']
}
function handleEnd(payload: BingDragDropEndPayload) {
  record(payload.canceled ? 'drag-end 已取消' : `drag-end 落点 ${payload.to ?? '区域外'}`)
}
</script>

<template>
  <div class="rules">
    <BingCheckbox v-model="dropOnSource" label="放回原区域也触发 drop" />
    <BingDragDrop v-slot="{ active }" :dropOnSource="dropOnSource"
      @drag-start="record(`drag-start ${$event.id}`)" @drag-over="handleOver" @drop="handleDrop" @drag-end="handleEnd">
      <div class="zones">
        <BingDropZone v-for="zone in (['doing', 'testing'] as const)" :id="zone" :key="zone" v-slot="{ state }" class="zone"
          :ariaLabel="zone === 'doing' ? '进行中' : '测试中'">
          <h3>{{ zone === 'doing' ? '进行中' : '测试中' }} <em>{{ state }}</em></h3>
          <BingDraggable v-for="task in tasks.filter(item => item.zone === zone)" :id="task.id" :key="task.id"
            :zone="zone" :disabled="task.locked" class="card">
            <strong>{{ task.id }} {{ task.title }}</strong>
            <span v-if="task.locked">已锁定，不能拖动</span>
            <!-- 输入框内按下不会开始拖动，可以正常选中文字。 -->
            <input v-else v-model="notes[task.id]" :aria-label="task.id + ' 备注'" placeholder="备注">
          </BingDraggable>
        </BingDropZone>
        <BingDropZone id="done" v-slot="{ state }" :accept="onlyFromTesting" class="zone zone--done" ariaLabel="已完成">
          <h3>已完成 <em>{{ state }}</em></h3>
          <p>{{ state === 'disabled' ? '只接受测试中的条目' : '从测试中拖到这里' }}</p>
          <div v-for="task in tasks.filter(item => item.zone === 'done')" :key="task.id" class="card">{{ task.id }} 已完成</div>
        </BingDropZone>
      </div>
      <!-- 根插槽的 active 在拖动期间非空，可以只在拖动时显示额外的放置区域。 -->
      <BingDropZone v-if="active" id="trash" v-slot="{ state }" class="trash" ariaLabel="删除">
        {{ state === 'over' ? '松手删除' : '拖到这里删除' }}
      </BingDropZone>
    </BingDragDrop>
    <ol class="events" aria-label="事件记录">
      <li v-for="(event, index) in events" :key="index">{{ event }}</li>
    </ol>
  </div>
</template>

<style scoped>
.rules { display: grid; gap: 12px; color: var(--bing-text); }
.zones { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.zone { display: grid; align-content: start; gap: 8px; min-height: 180px; padding: 12px; border: 1px dashed var(--bing-border); border-radius: 8px; }
.zone.is-over { border-color: var(--bing-accent); }
.zone.is-disabled { opacity: 0.5; }
h3 { display: flex; justify-content: space-between; margin: 0; color: var(--bing-heading); font-size: 14px; }
em { color: var(--bing-muted); font-size: 12px; font-style: normal; font-weight: 400; }
.zone p { margin: 0; color: var(--bing-muted); font-size: 13px; }
.card { display: grid; gap: 6px; padding: 8px 12px; border: 1px solid var(--bing-border); border-radius: 8px; background: var(--bing-surface-solid); }
.card.is-drag-source { opacity: 0.35; }
.card.is-disabled { cursor: not-allowed; }
.card strong { font-weight: 500; }
.card span { color: var(--bing-muted); font-size: 12px; }
.card input { min-height: 32px; padding: 0 8px; border: 1px solid var(--bing-border); border-radius: 6px; background: transparent; color: inherit; font: inherit; }
.trash { display: grid; place-items: center; min-height: 56px; margin-top: 12px; border: 1px dashed var(--bing-danger, #d92d20); border-radius: 8px; color: var(--bing-danger, #d92d20); }
.trash.is-over { background: color-mix(in srgb, var(--bing-danger, #d92d20) 8%, transparent); }
.events { min-height: 100px; margin: 0; padding-left: 20px; color: var(--bing-muted); font-size: 13px; }
</style>
