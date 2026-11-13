<script setup lang="ts">
import { ref } from 'vue'
import { BingSortableList, type BingSortableListKey, type BingSortableListPayload, type BingSortableListDragPayload } from '@moubing/bing-ui'
type Item = { id: string; title: string }
const items: Item[] = [{ id: 'a', title: '甲' }, { id: 'b', title: '乙' }, { id: 'c', title: '丙' }]
const order = ref<BingSortableListKey[]>(['b', 'missing', 'b'])
const live = ref(false), disabled = ref(false), lockB = ref(false), ignore = ref(false)
const events = ref<string[]>([]), detail = ref('')
function reset() { order.value = ['a', 'b', 'c']; events.value = []; detail.value = '' }
function update(value: BingSortableListKey[]) { if (!ignore.value) order.value = value; events.value.push('update') }
function reorder(payload: BingSortableListPayload<Item>) { events.value.push('reorder'); detail.value = JSON.stringify({ key: payload.key, from: payload.from, to: payload.to, order: payload.order, event: payload.event?.type }) }
function drag(name: string, payload: BingSortableListDragPayload<Item>) { events.value.push(name); detail.value = JSON.stringify({ index: payload.index, order: payload.order, event: payload.event.type }) }
</script>
<template>
  <main style="padding: 24px; max-width: 520px">
    <button @click="reset">重置有效顺序</button>
    <label><input v-model="live" type="checkbox">实时提交</label>
    <label><input v-model="disabled" type="checkbox">禁用列表</label>
    <label><input v-model="lockB" type="checkbox">禁用乙</label>
    <label><input v-model="ignore" type="checkbox">忽略更新</label>
    <BingSortableList :items="items" :order="order" :itemKey="item => item.id" :disabledKeys="lockB ? ['b'] : []"
      :disabled="disabled" :reorderMode="live ? 'live' : 'drop'" :flip="false" :duration="0" :settleDuration="0"
      :handleAriaLabel="item => `移动 ${item.title}`" ariaLabel="阅读排序" @update:order="update" @reorder="reorder"
      @drag-start="drag('start', $event)" @drag="drag('drag', $event)" @drag-end="drag('end', $event)">
      <template #default="{ item, handleProps }"><button type="button" v-bind="handleProps" class="reading-card">{{ item.title }}</button></template>
    </BingSortableList>
    <pre id="model">{{ JSON.stringify(order) }}</pre><pre id="events">{{ JSON.stringify(events) }}</pre><pre id="detail">{{ detail }}</pre>
  </main>
</template>
<style scoped>
.reading-card { width: 100%; height: 60px; border: 1px solid #94a3b8; border-radius: 8px; background: #e2e8f0; color: #0f172a; touch-action: none; }
</style>
