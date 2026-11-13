::::article{class="doc-page"}
<p class="doc-eyebrow">组件</p>

# BingToast {#overview}

BingToast 是全局消息提示系统，用于保存成功、提交失败、异步处理中、警告和信息提醒。页面中挂载 `BingToast` 作为视口，然后通过 `bingToast` 或 `useBingToast()` 创建、更新、关闭和清空消息。两种入口返回同一个服务，共享消息队列。

:::section{id="viewport-service" class="doc-section"}
## 视口和服务

`BingToast` 本身只负责渲染消息视口；真正创建消息的是 `bingToast` 服务。一个页面通常只需要挂载一个 `viewportPosition="all"` 的视口。 `smoothScroll` 默认作用于各位置的消息堆叠滚动区域；设为 `false` 可关闭。

当前同时挂载多个视口时，只有最先注册的视口显示消息，它卸载后才由下一个接替。因此不要用多个视口分别承载不同位置；使用一个 `all` 视口即可。创建消息时不要求已有视口，计时器从服务调用时开始，可能在视口挂载前到期。

从包根导入组件与服务，并导入 `@moubing/bing-ui/style.css`。在浏览器事件或挂载后创建提示；Nuxt 可将视口放入 `ClientOnly`，不要在服务端渲染期间调用共享服务创建业务消息。下方每个示例可单独运行；业务应用已有视口时，只保留一个全局视口。示例卸载时仅关闭自己创建的消息。

使用 `KeepAlive` 时，离开缓存页面只会触发 `onDeactivated`，不会卸载页面。推荐将唯一视口放在缓存页面之外，并在业务页停用时清理自己的异步演示任务；如果视口必须跟随页面，停用时用 `v-if` 卸载它，否则 Teleport 内容和活动视口资格仍会保留。文档站按后一种方式处理。

::toast-basic-example
::

:::

:::section{id="types" class="doc-section"}
## 消息类型

服务方法会预设消息类型。`success`、`error`、`warning` 和`info` 会使用不同图标和强调色；`loading` 默认不会自动关闭。

0.6.0 使用中性卡片、细边框和更轻的阴影，各消息类型通过图标及局部颜色区分。下方“当前调用”卡展示配置内容；点击创建后，实际 Toast 出现在所选视口位置。

默认持续时间为 default 3200、success 2600、error 4200、loading 0、warning 3600、info 3200 毫秒。有限负值按 0 处理，0 表示不自动关闭；非有限值使用类型默认值。error、warning 使用 `role="alert"` 和 assertive，其他类型使用 status 和 polite；`closable=false` 只隐藏关闭按钮，不阻止计时器或服务关闭。

::toast-types-example
::

:::

:::section{id="loading-update" class="doc-section"}
## Loading 更新

传入固定 `id` 可以更新同一条 Toast。常见用法是先创建 loading，请求完成后用同一个 id 更新为 success 或 error。

同 id 更新会按新输入重新生成整条消息，仅保留创建时间和排序编号；它不会合并旧字段。位置、标题、关闭按钮等需要重新提供，否则回到默认值。若该 id 已被关闭，再调用就会重新创建；示例先检查消息是否存在，并在取消或卸载时清理模拟定时器。

新增或更新任一消息会重启整个队列的自动关闭计时器。同位置按旧到新顺序额外错开 120ms；悬停提示区域或让提示获得焦点会暂停整个队列，离开后按完整 duration 重新计时，不是继续剩余时间。按钮关闭还会重启剩余队列；服务 `close`、`clear` 和自动到期不触发组件的 `close` 事件。

::toast-loading-example
::

:::

:::section{id="action" class="doc-section"}
## 操作按钮

`action` 在提示内放一个操作按钮，常用于“已移动 / 已删除，撤销”这类可以马上反悔的操作。按钮位于正文和关闭按钮之间，`label` 是按钮文字，`ariaLabel` 可补充更完整的可访问名称。

`onClick` 同步返回时立即按 `closeOnClick`（默认 true）关闭提示。返回 Promise 时，按钮显示加载并禁用重复点击，这条提示暂停自动关闭；兑现后关闭，`closeOnClick=false` 时恢复按钮并重新计时。Promise 拒绝表示操作没有成功：提示和按钮保留供重试，组件不额外报错，失败原因由调用方另行提示。同步抛出的异常视为代码缺陷，会交给应用的 errorHandler。

未指定 `duration` 时，带操作的提示至少保留 6000 毫秒，loading 仍不自动关闭；显式传入的 duration 不受影响。处理中用同 id 更新文字且传入同一个 action 对象时，处理中状态保留；原对象和它的 Vue 响应式代理视为同一个 action。重新创建配置对象表示更换操作，即使按钮文字和回调函数相同也不延续 loading。

换成新的 action，或关闭提示后重新创建同 id 的提示，旧 Promise 的成功或失败都不会改变新提示的 loading、计时或关闭状态。该规则也适用于 `onClick` 在第一次 `await` 之前同步替换提示的情况。下面的示例在撤销期间复用原 action 更新进度文字。

::toast-action-example
::

:::

:::section{id="positions" class="doc-section"}
## 位置

`position` 控制单条消息出现的位置。`top-center` 会映射为 `top`，`bottom-center` 会映射为 `bottom`，用于兼容更直观的命名。

固定位置视口只显示对应消息，其他消息仍在全局队列中并参与计时。`max` 仅控制视觉深度，不限制队列长度或实际渲染条数；重复点击可看到全部消息保留在可滚动区域。`clear('top-center')` 会清空归一化后的 top 位置。

::toast-positions-example
::

:::

:::section{id="props" class="doc-section"}
## Props

::docs-api-table{name="props"}
::

:::

:::section{id="options" class="doc-section"}
## BingToastOptions

::docs-api-table{name="option"}
::

### BingToastAction {#action-api}

::docs-api-table{name="action"}
::

:::

:::section{id="service" class="doc-section"}
## 服务 API

::docs-api-table{name="service"}
::

:::

:::section{id="events" class="doc-section"}
## Events

::docs-api-table{name="events"}
::

:::

:::section{id="api-types" class="doc-section"}
## 公开类型

::docs-api-table{name="types"}
::

`BingToastItem` 是 `getToasts()` 数组元素和 `close` 事件参数。返回数组是浅拷贝，不应直接修改其中对象；通过服务方法更新队列。

::docs-api-table{name="item"}
::

:::

::::
