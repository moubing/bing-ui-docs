# AI 文档的测试页面

这个目录是供浏览器测试使用的独立 Vue/Vite 应用，用于验证各组件的 AI 文档示例和阅读应用用例。

这里的文件是需要维护的测试输入。面向 AI 发布的文档位于 `public/ai/components/`。

## 文件用途

| 文件 | 用途 |
| --- | --- |
| `*-understanding.vue`、`understanding.vue` | 根据文档另写的应用用例，检查属性、事件和组合用法是否符合文档说明。`understanding.vue` 是最初的 Form 用例。 |
| `main.ts`、`index.html` | 测试页面入口，根据 URL 参数挂载相应示例。 |
| `vite.config.ts` | 从生成的 Markdown 提取完整 Vue 示例，通过虚拟模块交给 Vite 运行，避免再维护一份复制代码。 |
| `virtual.d.ts` | 声明 Vite 客户端类型、Vue 模块及测试使用的虚拟模块。 |
| `tsconfig.json` | 为原始测试文件提供独立的 Vue/Vite 类型检查环境，让编辑器识别 CSS 导入等 Vite 能力。 |

例如，`button-understanding.vue` 用原生表单组合多个按钮，配合 `tests/ai-browser/button-export.spec.ts` 检查普通按钮不会提交表单、提交与重置、插槽、加载状态、无文字按钮命名及关闭节流。

浏览器测试通过 `/?component=button&example=basic` 加载文档中的完整示例，通过 `/?understanding=button` 加载另写的 Button 应用用例。测试断言位于 `tests/ai-browser/`。

这些应用用例是同一助手阅读文档后编写的检查，没有进行独立模型盲测。

## 样式导入和类型检查

每个用例使用显式导入，独立于文档站的 Nuxt 自动导入和全局样式：

```ts
import '@moubing/bing-ui/style.css'
```

这是组件包公开的样式入口，包的 `exports` 将它映射到 `dist/bing-ui.css`。CSS 的 TypeScript 声明由 `vite/client` 提供。

在仓库根目录运行：

```powershell
# 检查本目录的 Vue 用例及测试页面入口
pnpm exec vue-tsc -p tests/fixtures/ai-docs/tsconfig.json

# 从生成的文档提取示例，并连同应用用例做严格类型检查
pnpm typecheck:ai-examples

# 只检查 Button 的生成示例及对应阅读应用
pnpm typecheck:ai-examples button

# 只运行 Button 的导出示例和应用用例，无头浏览器由测试启动和关闭
pnpm test:ai-examples button-export.spec.ts
```
