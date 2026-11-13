<script setup lang="ts">
import { BingScrollbar } from '@moubing/bing-ui'
</script>

<template>
  <div class="site-shell home-layout-shell">
    <SiteHeader />
    <BingScrollbar
      class="home-page-scrollbar"
      height="100%"
      always
      aria-label="首页内容"
    >
      <main class="site-main">
        <slot />
      </main>
    </BingScrollbar>
  </div>
</template>
