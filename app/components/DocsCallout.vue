<script setup lang="ts">
import { computed } from 'vue'

type DocsCalloutType = 'note' | 'info' | 'tip' | 'warning' | 'danger'

const props = withDefaults(
  defineProps<{
    type?: DocsCalloutType
    title?: string
  }>(),
  {
    type: 'note',
    title: undefined,
  },
)

const defaultTitles: Record<DocsCalloutType, string> = {
  note: '备注',
  info: '信息',
  tip: '提示',
  warning: '注意',
  danger: '危险',
}

const resolvedTitle = computed(() => props.title || defaultTitles[props.type])
</script>

<template>
  <aside
    class="docs-callout"
    :class="`docs-callout--${type}`"
    :aria-label="resolvedTitle"
  >
    <div class="docs-callout__icon" aria-hidden="true">
      <slot name="icon">
        <svg v-if="type === 'tip'" viewBox="0 0 24 24" fill="none">
          <path d="M9 18h6M10 22h4M8.5 15.5c-1.2-1-2-2.5-2-4.2a5.5 5.5 0 1 1 11 0c0 1.7-.8 3.2-2 4.2-.6.5-.8 1-.8 1.5H9.3c0-.5-.2-1-.8-1.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none">
          <path d="M12 8v5m0 3.5v.1M10.2 4.4 3.1 17a2 2 0 0 0 1.8 3h14.2a2 2 0 0 0 1.8-3L13.8 4.4a2 2 0 0 0-3.6 0Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="type === 'danger'" viewBox="0 0 24 24" fill="none">
          <path d="M9 3h6l4.2 4.2V13L15 17.2H9L4.8 13V7.2L9 3Zm3 4.5v5m0 3v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="type === 'info'" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
          <path d="M12 11v5m0-8.2v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none">
          <path d="M7 4.5h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2Zm2 4h6m-6 4h6m-6 4h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </slot>
    </div>

    <div class="docs-callout__body">
      <div class="docs-callout__title">
        <slot name="title">{{ resolvedTitle }}</slot>
      </div>
      <div class="docs-callout__content">
        <slot />
      </div>
    </div>
  </aside>
</template>

<style scoped>
.docs-callout {
  --docs-callout-accent: #6b7280;
  --docs-callout-tint: rgba(101, 113, 136, 0.07);

  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.8rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--docs-callout-accent) 22%, var(--line, #d9e1ec));
  border-radius: 8px;
  background: var(--docs-callout-tint);
  padding: 1rem 1.1rem;
  color: var(--ink, #172033);
  box-shadow: 0 1px 2px rgba(23, 32, 51, 0.03);
}

.docs-callout--info {
  --docs-callout-accent: var(--blue, #1f6feb);
  --docs-callout-tint: rgba(31, 111, 235, 0.065);
}

.docs-callout--tip {
  --docs-callout-accent: var(--green, #2f9e78);
  --docs-callout-tint: rgba(47, 158, 120, 0.075);
}

.docs-callout--warning {
  --docs-callout-accent: #b7791f;
  --docs-callout-tint: rgba(183, 121, 31, 0.075);
}

.docs-callout--danger {
  --docs-callout-accent: var(--coral, #ef6f5e);
  --docs-callout-tint: rgba(239, 111, 94, 0.075);
}

.docs-callout__icon {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--docs-callout-accent) 28%, transparent);
  border-radius: 7px;
  background: color-mix(in srgb, var(--docs-callout-accent) 9%, transparent);
  color: var(--docs-callout-accent);
}

.docs-callout__icon :deep(svg) {
  width: 17px;
  height: 17px;
}

.docs-callout__body {
  display: grid;
  min-width: 0;
  gap: 0;
}

.docs-callout__title {
  display: flex;
  min-height: 28px;
  align-items: center;
  color: var(--docs-callout-accent);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.55;
  text-transform: uppercase;
}

.docs-callout__content {
  margin-top: 0.2rem;
  color: var(--muted, #657188);
  font-size: 0.94rem;
  line-height: 1.72;
}

.docs-callout__content :deep(> :first-child) {
  margin-top: 0;
}

.docs-callout__content :deep(> :last-child) {
  margin-bottom: 0;
}

.docs-callout__content :deep(a) {
  color: var(--docs-callout-accent);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

@media (max-width: 560px) {
  .docs-callout {
    gap: 0.7rem;
    padding-inline: 1rem;
  }
}
</style>
