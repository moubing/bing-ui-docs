<script setup lang="ts">
import { ref, computed } from 'vue'
import { BingAppSwitcherTransition, type BingAppSwitcherTransitionItem, type BingTabValue } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'
const value = ref<BingTabValue>('a')
const disabled = ref(false)
const sync = ref(true)
const updates = ref(0)
const changes = ref(0)
const middleDisabled = ref(true)
const items = computed<BingAppSwitcherTransitionItem[]>(() => [
  { value: 'a', label: '甲' }, { value: 'b', label: '乙', disabled: middleDisabled.value }, { value: 'c', label: '丙' },
])
function update(next: BingTabValue) { updates.value++; if (sync.value) value.value = next }
</script>

<template>
  <label><input id="disabled" v-model="disabled" type="checkbox">禁用内部选择</label>
  <label><input id="sync" v-model="sync" type="checkbox">同步模型</label>
  <label><input id="middle-disabled" v-model="middleDisabled" type="checkbox">禁用乙</label>
  <button id="external" @click="value = 'b'">外部选择乙</button>
  <button id="invalid" @click="value = 'missing'">外部无效值</button>
  <BingAppSwitcherTransition :modelValue="value" :items="items" :disabled="disabled" ariaLabel="阅读面板" @update:modelValue="update" @change="changes++">
    <template #default="{ item, active, isAnimating }">
      <div :inert="!active" :class="{ 'is-animating': isAnimating }"><h2>{{ item.label }}</h2><button>{{ item.label }}操作</button></div>
    </template>
  </BingAppSwitcherTransition>
  <p role="status">模型 {{ value }}；更新 {{ updates }}；变化 {{ changes }}</p>
</template>
