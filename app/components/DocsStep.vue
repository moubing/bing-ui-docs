<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <li class="docs-step">
    <div class="docs-step__body">
      <h3 v-if="title || $slots.title" class="docs-step__title">
        <slot name="title">{{ title }}</slot>
      </h3>
      <div class="docs-step__content">
        <slot />
      </div>
    </div>
  </li>
</template>

<style scoped>
.docs-step__body {
  min-width: 0;
  padding-top: 0.1rem;
}

.docs-step__title {
  margin: 0 0 0.55rem;
  color: var(--ink, #172033);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.55;
}

.docs-step__content {
  min-width: 0;
  color: var(--muted, #657188);
  line-height: 1.75;
}

.docs-step__content :deep(> :first-child) {
  margin-top: 0;
}

.docs-step__content :deep(> :last-child) {
  margin-bottom: 0;
}

.docs-step__content :deep(> .docs-callout) {
  margin-top: 0.85rem;
}
</style>
