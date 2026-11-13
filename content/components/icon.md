::::article{class="doc-page icon-doc"}
<p class="doc-eyebrow">组件</p>

# BingIcon {#overview}

BingIcon 是图标规范层，用来把具体图标组件统一成一套尺寸、语义色、描边和可访问性规则。它不内置图标全集，也不把组件库绑定到某个图标库；项目里可以传入 lucide-vue-next 或本地 SVG/Vue 图标。

下方完整示例使用 `lucide-vue-next 1.0.0`，需要显式安装：`pnpm add lucide-vue-next@1.0.0`。自 0.12.0 起组件库内置图标已固化为本地 SVG，不再依赖或附带 lucide-vue-next；图标库并不是 BingIcon 的必选依赖，本地图标组件也可使用，但须把 class、style、role 和 aria 属性透传给实际 SVG 元素。静态导入的图标无需 markRaw；只有将组件对象放入深层响应式数据时才需要避免它被代理。

:::section{id="playground" class="doc-section"}
## 基础配置

通过 `icon` 传入图标组件，再用 `size`、`tone` 和`strokeWidth` 控制视觉表现。图标有明确语义时，关闭 `decorative` 并提供`label`。

0.6.0 默认描边为 1.75，与新版控件中的图标一致。需要其他线宽时显式设置 strokeWidth；演示中的 lg 尺寸和 primary 颜色用于便于观察，组件默认仍为 md 和 inherit。

::icon-basic-example
::

:::

:::section{id="sizes" class="doc-section"}
## 尺寸

`size` 支持五个 token，也可以传数字或 px 字符串。数字会被转换为 px，适合临时对齐某个局部视觉规格。

五个尺寸依次为 `xs=14px`、`sm=16px`、`md=20px`、`lg=24px`、`xl=32px`。

::icon-sizes-example
::

:::

:::section{id="tones" class="doc-section"}
## 语义色

`tone` 用来表达图标语义，避免每个业务页面重复写颜色。`inherit`会继承当前文字颜色，适合跟随按钮、标签或普通文本。

::icon-tones-example
::

:::

:::section{id="accessibility" class="doc-section"}
## 可访问性

只用来装饰文字或按钮时，让图标保持装饰性即可。图标本身承担信息时，需要设置`decorative=false` 并提供 `label`。

当前版本在 label 为空字符串或未提供时仍会隐藏图标，即使 decorative=false。仅传 label 不会覆盖 decorative=true。图标不提供按钮行为；“打开通知”在此只是名称示例，如果需要点击操作，应放入有可访问名称的按钮，并让内部图标保持装饰性。

::icon-accessibility-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

::::
