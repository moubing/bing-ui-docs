<script setup lang="ts">
import { ref } from 'vue'
import { BingButton, BingScrollbar, type BingScrollbarExpose } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const disabledPanel = ref<BingScrollbarExpose | null>(null)
</script>

<template>
  <div style="display: grid; gap: 20px; max-width: 500px">
    <BingScrollbar height="120px" :vertical="false" :horizontal="false" :smooth="false" ariaLabel="关闭轨道的区域">
      <div style="height: 500px">轨道开关不改变原生 overflow。</div>
    </BingScrollbar>
    <BingScrollbar height="120px" ariaLabel="短内容区域"><p>没有溢出仍有名称。</p></BingScrollbar>
    <BingScrollbar ref="disabledPanel" height="120px" disabled ariaLabel="禁用区域">
      <div style="height: 500px">禁用输入后仍可程序滚动。</div>
    </BingScrollbar>
    <BingButton :throttle="false" @click="disabledPanel?.scrollTo(100)">程序滚动禁用区域</BingButton>
  </div>
</template>
