<script setup lang="ts">
import { ref } from 'vue'
import {
  BingButton, BingDragDrop, BingDraggable, BingDragOverlay, BingDropDown, BingDropDownItem, BingDropZone,
  type BingDragDropDropPayload,
} from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

type Status = 'queued' | 'doing' | 'testing'
type Task = { id: string; title: string; status: Status }

const columns: { id: Status; name: string }[] = [
  { id: 'queued', name: '待处理' },
  { id: 'doing', name: '进行中' },
  { id: 'testing', name: '测试中' },
]
const tasks = ref<Task[]>([
  { id: 'REQ-12', title: '导出筛选结果为表格', status: 'queued' },
  { id: 'REQ-15', title: '评论支持提及成员', status: 'queued' },
  { id: 'REQ-9', title: '首页改为个人工作台', status: 'doing' },
  { id: 'BUG-4', title: '粘贴图片偶发丢失', status: 'doing' },
  { id: 'REQ-3', title: '版本对比支持表格', status: 'testing' },
])
const log = ref('拖动卡片到其他列，或用卡片右侧的菜单移动')

function nameOf(status: Status) {
  return columns.find(column => column.id === status)!.name
}
function move(id: string, status: Status, via: string) {
  const task = tasks.value.find(item => item.id === id)
  if (!task || task.status === status) return
  task.status = status
  log.value = `${via}：${id} 移到${nameOf(status)}`
}
// drop 只在落到其他区域时触发；放回原列或松手在区域外只会归位。
function handleDrop(payload: BingDragDropDropPayload<Task>) {
  move(String(payload.id), payload.to as Status, '拖动')
}
</script>

<template>
  <BingDragDrop @drop="handleDrop">
    <div class="board">
      <BingDropZone v-for="column in columns" :id="column.id" :key="column.id" v-slot="{ state }"
        tag="section" class="column" :ariaLabel="column.name">
        <h3>{{ column.name }}<span v-if="state === 'over'">松手移到这里</span></h3>
        <BingDraggable v-for="task in tasks.filter(item => item.status === column.id)" :id="task.id" :key="task.id"
          :zone="column.id" :data="task" class="card">
          <a :href="'#' + task.id" @click.prevent="log = '打开 ' + task.id"><small>{{ task.id }}</small>{{ task.title }}</a>
          <!-- 拖动只支持指针，菜单为键盘和读屏用户提供同样的移动能力；按钮内按下不会开始拖动。 -->
          <BingDropDown :ariaLabel="task.id + ' 移动到'" placement="bottom-end">
            <template #trigger="{ triggerProps }">
              <BingButton v-bind="triggerProps" variant="ghost" size="sm" :throttle="false" :ariaLabel="task.id + ' 操作'">⋯</BingButton>
            </template>
            <BingDropDownItem v-for="target in columns.filter(item => item.id !== task.status)" :key="target.id"
              :title="'移到' + target.name" @click="move(task.id, target.id, '菜单')" />
          </BingDropDown>
        </BingDraggable>
      </BingDropZone>
    </div>
    <BingDragOverlay v-slot="{ data }">
      <div class="card card--overlay"><small>{{ data.id }}</small>{{ data.title }}</div>
    </BingDragOverlay>
  </BingDragDrop>
  <p role="status" class="log">{{ log }}</p>
</template>

<style scoped>
.board { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
.column { display: grid; align-content: start; gap: 8px; min-height: 220px; padding: 12px; border: 1px dashed transparent; border-radius: 8px; background: var(--bing-surface); transition: border-color 160ms, background 160ms; }
.column.is-target { border-color: var(--bing-border); }
.column.is-over { border-color: var(--bing-accent); background: color-mix(in srgb, var(--bing-accent) 6%, var(--bing-surface)); }
h3 { display: flex; gap: 8px; margin: 0 0 4px; color: var(--bing-heading); font-size: 14px; }
h3 span { margin-left: auto; color: var(--bing-accent); font-size: 12px; font-weight: 400; }
.card { display: flex; align-items: center; gap: 8px; min-height: 44px; padding: 8px 8px 8px 12px; border: 1px solid var(--bing-border); border-radius: 8px; background: var(--bing-surface-solid); color: var(--bing-text); }
.card.is-drag-source { opacity: 0.35; border-style: dashed; }
.card a { flex: 1; min-width: 0; color: inherit; text-decoration: none; }
small { display: block; color: var(--bing-muted); font-size: 12px; }
.card--overlay { display: block; height: 100%; box-sizing: border-box; box-shadow: var(--bing-popover-shadow); }
.log { margin: 12px 0 0; color: var(--bing-muted); font-size: 13px; }
</style>
