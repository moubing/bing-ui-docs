<script setup lang="ts">
import { BingCodeBlock } from '@moubing/bing-ui'
import { useExamples } from './state'
const { statusCode } = useExamples()
</script>

<template>
  <BingCodeBlock :code="statusCode" language="vue" title="状态示例" wrap />
</template>
