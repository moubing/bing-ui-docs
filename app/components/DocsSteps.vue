<template>
  <ol class="docs-steps">
    <slot />
  </ol>
</template>

<style scoped>
.docs-steps {
  display: grid;
  gap: 0;
  margin: 1.35rem 0;
  padding: 0;
  counter-reset: docs-step;
  list-style: none;
}

.docs-steps :deep(> .docs-step) {
  position: relative;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 0.9rem;
  padding-bottom: 1.6rem;
  counter-increment: docs-step;
}

.docs-steps :deep(> .docs-step:last-child) {
  padding-bottom: 0;
}

.docs-steps :deep(> .docs-step::before) {
  position: relative;
  z-index: 1;
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--blue, #1f6feb) 32%, var(--line, #d9e1ec));
  border-radius: 8px;
  background: var(--surface, #ffffff);
  color: var(--blue, #1f6feb);
  content: counter(docs-step, decimal-leading-zero);
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1;
  box-shadow: inset 0 -2px 0 color-mix(in srgb, var(--blue, #1f6feb) 14%, transparent);
}

.docs-steps :deep(> .docs-step:not(:last-child)::after) {
  position: absolute;
  top: 34px;
  bottom: 4px;
  left: 14px;
  width: 1px;
  background: var(--line, #d9e1ec);
  content: "";
}

@media (max-width: 560px) {
  .docs-steps :deep(> .docs-step) {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 0.7rem;
  }

  .docs-steps :deep(> .docs-step::before) {
    width: 28px;
    height: 28px;
  }

  .docs-steps :deep(> .docs-step:not(:last-child)::after) {
    top: 32px;
    left: 13px;
  }
}
</style>
