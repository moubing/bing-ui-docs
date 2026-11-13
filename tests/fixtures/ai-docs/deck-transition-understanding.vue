<script setup lang="ts">
import { ref, computed } from 'vue'
import { BingDeckTransition, type BingDeckTransitionItem, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref<BingTabValue>('a')
const disabled = ref(false)
const middleDisabled = ref(true)
const sync = ref(true)
const loop = ref(true)
const showControls = ref(true)
const changes = ref(0)
const updates = ref(0)
const items = computed<BingDeckTransitionItem[]>(() => [{ value: 'a', label: '甲' }, { value: 'b', label: '乙', disabled: middleDisabled.value }, { value: 'c', label: '丙' }])
function update(next: BingTabValue) { updates.value++; if (sync.value) value.value = next }
</script>

<template>
  <label><input id="disabled" v-model="disabled" type="checkbox">禁用</label>
  <label><input id="middle-disabled" v-model="middleDisabled" type="checkbox">禁用乙</label>
  <label><input id="sync" v-model="sync" type="checkbox">同步模型</label>
  <label><input id="loop" v-model="loop" type="checkbox">循环</label>
  <label><input id="controls" v-model="showControls" type="checkbox">控制区</label>
  <button id="external" @click="value = 'b'">外部选择乙</button>
  <BingDeckTransition :modelValue="value" :items="items" :disabled="disabled" :loop="loop" :showControls="showControls" controlLabel="阅读下一张" @update:modelValue="update" @change="changes++">
    <template #default="{ item, active, isAnimating }"><div :inert="!active" :class="{ 'is-animating': isAnimating }"><h2>{{ item.label }}</h2><button>{{ item.label }}操作</button></div></template>
  </BingDeckTransition>
  <p role="status">模型 {{ value }}；更新 {{ updates }}；变化 {{ changes }}</p>
</template>
