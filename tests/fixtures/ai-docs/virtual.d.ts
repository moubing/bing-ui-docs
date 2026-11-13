/// <reference types="vite/client" />

declare module '*.vue' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}
declare module 'virtual:docs-registry' {
  import type { Component } from 'vue'
  const examples: Record<string, () => Promise<{ default: Component }>>
  export default examples
}
