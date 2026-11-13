<script setup lang="ts">
import { ref } from 'vue'
import { BingCard, BingTag } from '@moubing/bing-ui'
import '@moubing/bing-ui/style.css'

const face = ref<'front' | 'back'>('front')
</script>

<template>
  <BingCard
    class="showcase-card"
    role="group"
    tabindex="0"
    :aria-label="`交互卡片，当前为${face === 'front' ? '正面' : '反面'}；按 Enter 或空格翻面`"
    @flip="face = $event"
    @keydown.enter.prevent="($event.currentTarget as HTMLElement).click()"
    @keydown.space.prevent
    @keyup.space.prevent="($event.currentTarget as HTMLElement).click()"
    variant="accent"
    rounded="lg"
    padding="lg"
    entrance="soft-pop"
    flip-trigger="click"
    flip-axis="y"
    :tilt-max="7"
    :tilt-scale="1.02"
  >
    <div class="showcase-card__front">
      <div class="showcase-card__meta">
        <BingTag label="New release" tone="primary" variant="soft" />
        <span>v0.8.2</span>
      </div>
      <h3>Interfaces<br>with feeling.</h3>
      <p>点击卡片，看看另一面。</p>
      <span class="showcase-card__arrow" aria-hidden="true">↗</span>
    </div>

    <template #back>
      <div class="showcase-card__back">
        <span class="section-eyebrow">COMPOSED</span>
        <strong>Motion + Theme + Content</strong>
        <p>所有能力都通过清晰的属性和插槽组合。</p>
        <code>&lt;BingCard flip-trigger="click" /&gt;</code>
      </div>
    </template>
  </BingCard>
</template>

<style scoped>
.showcase-card {
  position: relative;
  z-index: 2;
  width: min(100%, 370px);
  min-height: 320px;
}

.showcase-card :deep(.bing-card__body) {
  min-height: 320px;
}

.showcase-card__front,
.showcase-card__back {
  display: grid;
  min-height: 250px;
  align-content: center;
}

.showcase-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.showcase-card__meta > span {
  color: var(--bing-muted);
  font-size: 0.7rem;
}

.showcase-card__front h3 {
  margin: 36px 0 0;
  color: var(--bing-heading);
  font-size: clamp(2rem, 3vw, 3.1rem);
  line-height: 0.96;
  letter-spacing: -0.075em;
}

.showcase-card__front p,
.showcase-card__back p {
  margin: 18px 0 0;
  color: var(--bing-muted);
  font-size: 0.84rem;
  line-height: 1.7;
}

.showcase-card__arrow {
  position: absolute;
  right: 0;
  bottom: 0;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 50%;
  background: var(--bing-accent);
  color: var(--bing-accent-contrast);
  font-size: 1.2rem;
}

.showcase-card__back {
  text-align: center;
}

.showcase-card__back strong {
  margin-top: 20px;
  color: var(--bing-heading);
  font-size: 1.25rem;
}

.showcase-card__back code {
  margin-top: 24px;
  border: 1px solid var(--bing-border);
  border-radius: 10px;
  background: var(--bing-surface-muted);
  color: var(--bing-accent);
  padding: 10px;
  font-size: 0.68rem;
}

.section-eyebrow { color: var(--bing-muted); font-size: 0.75rem; letter-spacing: 0.075em; }
.showcase-card:focus-visible { outline: 2px solid var(--bing-focus); outline-offset: 4px; }
.showcase-card h3, .showcase-card strong { font-weight: 500; }
</style>
