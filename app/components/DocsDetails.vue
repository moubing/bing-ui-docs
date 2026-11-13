<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'

const { $gsap } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    title: string
    label?: string
    open?: boolean
    defaultOpen?: boolean
    expandLabel?: string
    collapseLabel?: string
  }>(),
  {
    label: undefined,
    open: undefined,
    defaultOpen: false,
    expandLabel: '展开',
    collapseLabel: '收起',
  },
)

const emit = defineEmits<{
  'update:open': [open: boolean]
  toggle: [open: boolean]
}>()

const detailsRef = ref<HTMLDetailsElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(props.open ?? props.defaultOpen)
const domOpen = ref(isOpen.value)
const contentId = `docs-details-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

let contentTween: ReturnType<typeof $gsap.to> | null = null

onMounted(() => {
  if (detailsRef.value) {
    detailsRef.value.open = isOpen.value
  }
})

onBeforeUnmount(() => {
  contentTween?.kill()
})

watch(
  () => props.open,
  (open) => {
    if (open !== undefined && open !== isOpen.value) {
      setOpen(open, false)
    }
  },
)

function handleSummaryClick(event: MouseEvent) {
  event.preventDefault()
  setOpen(!isOpen.value)
}

function setOpen(open: boolean, shouldEmit = true) {
  const details = detailsRef.value
  const content = contentRef.value

  if (!details || !content || prefersReducedMotion()) {
    contentTween?.kill()
    contentTween = null
    isOpen.value = open
    domOpen.value = open

    if (details) {
      details.open = open
    }

    if (content) {
      $gsap.set(content, { clearProps: 'height,opacity,overflow,willChange' })
    }

    emitState(open, shouldEmit)
    return
  }

  const wasRenderedOpen = details.open
  const currentHeight = wasRenderedOpen ? content.getBoundingClientRect().height : 0
  const currentOpacity = wasRenderedOpen ? Number($gsap.getProperty(content, 'opacity')) : 0

  contentTween?.kill()
  isOpen.value = open

  if (open) {
    domOpen.value = true
    details.open = true

    contentTween = $gsap.fromTo(
      content,
      {
        height: currentHeight,
        opacity: currentOpacity,
        overflow: 'hidden',
        willChange: 'height, opacity',
      },
      {
        height: content.scrollHeight,
        opacity: 1,
        duration: 0.34,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: clearContentTween,
      },
    )
  } else {
    contentTween = $gsap.fromTo(
      content,
      {
        height: currentHeight,
        opacity: currentOpacity,
        overflow: 'hidden',
        willChange: 'height, opacity',
      },
      {
        height: 0,
        opacity: 0,
        duration: 0.26,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          domOpen.value = false
          details.open = false
          clearContentTween()
        },
      },
    )
  }

  emitState(open, shouldEmit)
}

function clearContentTween() {
  if (contentRef.value) {
    $gsap.set(contentRef.value, { clearProps: 'height,opacity,overflow,willChange' })
  }

  contentTween = null
}

function emitState(open: boolean, shouldEmit: boolean) {
  if (!shouldEmit) {
    return
  }

  emit('update:open', open)
  emit('toggle', open)
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
</script>

<template>
  <details
    ref="detailsRef"
    class="docs-details"
    :class="{ 'is-open': isOpen }"
    :open="domOpen"
  >
    <summary
      class="docs-details__summary"
      :aria-controls="contentId"
      :aria-expanded="isOpen"
      @click="handleSummaryClick"
    >
      <span class="docs-details__sign" aria-hidden="true">
        <span />
        <span />
      </span>

      <span class="docs-details__heading">
        <span v-if="label" class="docs-details__label">{{ label }}</span>
        <span class="docs-details__title">
          <slot name="title">{{ title }}</slot>
        </span>
      </span>

      <span class="docs-details__action" aria-hidden="true">
        {{ isOpen ? collapseLabel : expandLabel }}
      </span>

      <svg
        class="docs-details__chevron"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path d="m6 8 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </summary>

    <div
      :id="contentId"
      ref="contentRef"
      class="docs-details__content"
      :aria-hidden="!isOpen"
    >
      <div class="docs-details__content-inner">
        <slot />
      </div>
    </div>
  </details>
</template>

<style scoped>
.docs-details {
  --docs-details-accent: var(--blue, #1f6feb);

  overflow: clip;
  border: 1px solid var(--line, #d9e1ec);
  border-radius: 8px;
  background: var(--surface, #ffffff);
  color: var(--ink, #172033);
  box-shadow: 0 1px 2px rgba(23, 32, 51, 0.035);
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
}

.docs-details.is-open {
  border-color: color-mix(in srgb, var(--docs-details-accent) 24%, var(--line, #d9e1ec));
  box-shadow: 0 10px 28px rgba(23, 32, 51, 0.055);
}

.docs-details__summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto;
  gap: 0.8rem;
  align-items: center;
  min-height: 72px;
  padding: 1rem 1.1rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
  transition: background 160ms ease;
}

.docs-details__summary::-webkit-details-marker {
  display: none;
}

.docs-details__summary:hover {
  background: color-mix(in srgb, var(--blue, #1f6feb) 4%, transparent);
}

.docs-details.is-open .docs-details__summary {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--docs-details-accent) 7%, transparent),
    transparent 62%
  );
}

.docs-details__summary:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--blue, #1f6feb) 28%, transparent);
  outline-offset: -3px;
}

.docs-details__sign {
  position: relative;
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--docs-details-accent) 34%, transparent);
  border-radius: 7px;
  background: color-mix(in srgb, var(--docs-details-accent) 8%, transparent);
  color: var(--docs-details-accent);
}

.docs-details__sign span {
  position: absolute;
  width: 12px;
  height: 1.5px;
  border-radius: 999px;
  background: currentColor;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.docs-details__sign span:last-child {
  transform: rotate(90deg);
}

.docs-details.is-open .docs-details__sign span:last-child {
  transform: rotate(0deg);
}

.docs-details__heading {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
}

.docs-details__label {
  color: var(--docs-details-accent);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.4;
  text-transform: uppercase;
}

.docs-details__title {
  overflow-wrap: anywhere;
  font-size: 0.98rem;
  font-weight: 500;
  line-height: 1.55;
}

.docs-details__action {
  color: var(--muted, #657188);
  font-size: 0.875rem;
  font-weight: 500;
}

.docs-details__chevron {
  width: 18px;
  height: 18px;
  color: var(--muted, #657188);
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.docs-details.is-open .docs-details__chevron {
  transform: rotate(180deg);
}

.docs-details__content {
  border-top: 1px solid color-mix(in srgb, var(--docs-details-accent) 13%, var(--line, #d9e1ec));
}

.docs-details__content-inner {
  padding: 1.1rem 1.25rem 1.25rem;
  color: var(--muted, #657188);
  line-height: 1.75;
}

.docs-details__content-inner :deep(> :first-child) {
  margin-top: 0;
}

.docs-details__content-inner :deep(> :last-child) {
  margin-bottom: 0;
}

@media (max-width: 560px) {
  .docs-details__summary {
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.65rem;
    padding-inline: 1rem;
  }

  .docs-details__action {
    display: none;
  }

  .docs-details__content-inner {
    padding-inline: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .docs-details,
  .docs-details__summary,
  .docs-details__sign span,
  .docs-details__chevron {
    transition: none;
  }
}
</style>
