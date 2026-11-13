::::article{class="doc-page animated-text-doc"}
<p class="doc-eyebrow">组件</p>

# BingAnimatedText {#overview}

BingAnimatedText 是文本动效层，用于给标题、按钮文案、运营语句这类短文本添加 shine 扫光、shimmer 状态光带或 jump 字符跳动效果。它把 GSAP 动画、SplitText 拆字、hover/once/always 触发和低动态偏好处理封装在组件内部，使用时只需要通过 props 描述效果。

:::section{id="effects" class="doc-section"}
## 效果类型

通过 `effect` 选择文本效果。下面的示例可以直接切换`none`、`shine`、`shimmer` 和 `jump`，同时修改文案。

组件不接收 text prop，文字通过默认插槽传入，外观字号和颜色继承上下文。示例的 options.text 是演示数据；不应把整个 options 当成组件原生属性直接传入。

0.6.0 会在同一实例中响应文字、effect、disabled 和动画参数变化，清理旧动画后重新初始化，无需为正常更新强制修改 key。jump 保留 Vue 管理的原始文字，只拆分装饰副本，避免切换效果或更新文案时丢字。

::animated-text-basic-example
::

:::

:::section{id="trigger" class="doc-section"}
## 触发方式

`trigger` 控制动画何时播放。`always` 适合持续吸引注意，`hover` 适合交互反馈，`once` 适合首屏进入动效。

always 在视口内循环、离开视口暂停；once 等待首次进入视口播放。hover 同时支持指针进入与键盘焦点，可用 hoverTarget 将感应区域扩展到父按钮；组件自身仍不会自动成为焦点目标。followPointer 默认开启：jump 从最近字符向两侧扩散，shine 从指针进入侧扫入；固定方向演示显式设置 false。

shineSpeed 默认 1.6 秒，最少 0.1 秒；shineInterval 默认 2.4 秒，负值按 0。shineDelay 用于首轮及每次 hover，always 后续只等 shineInterval。shine 保留原文字颜色叠加高光；shimmer 让常态文字减淡，用原色光带表示持续状态。关闭 followPointer 后，left 从右向左、right 反向。

::animated-text-shine-example
::

:::

:::section{id="jump" class="doc-section"}
## Jump 字符跳动

`jump` 会把文本拆成字符并错峰播放。它适合按钮文案、空状态标题、短促提示语这类需要轻微反馈的内容。

jump 使用内置 SplitText 拆成词和字符，插槽文字不需要自行拆分或注册插件。单字符上行和回落合计 jumpDuration，整轮另加字符错峰；jumpStagger/jumpRepeatDelay 负值按 0。jumpY 正值向下，向下的额外空间需要业务布局预留。

原始文字保留在文档中；装饰副本整体设置 aria-hidden 和 inert，避免重复朗读或取得焦点。中文、日文词组允许换行。组件本身是 span，不是按钮，不自动获得焦点。建议使用短纯文本，将链接/按钮等交互元素放在拆字区域外，并在实际页面核对辅助技术表现。

::animated-text-jump-example
::

:::

:::section{id="disabled" class="doc-section"}
## 禁用动画

使用 disabled 可以停止 shine 或 jump，清理当前动画及拆字副本，原始文字继续显示。

这里演示 shine 的停止和重新初始化，不会从原进度继续播放。基础示例切换到 jump 后也可直接禁用，无需卸载实例。

减少动态效果偏好会在初始化、播放和媒体查询 change 事件中处理，BingConfigProvider 的 `reducedMotion` 变化也会触发同样的处理；偏好切换后停止动画并显示普通文本，恢复动态效果后按当前 trigger 重新初始化。本页缓存停用时卸载示例，以清理循环、计时任务、媒体查询监听和 SplitText。

::animated-text-disabled-example
::

:::

:::section{id="motion" class="doc-section"}
## 状态光带、文字切换与手动播放

swap 默认关闭。开启后，保留字符移动到新位置，新旧字符分别进出；适合计数、上传状态和短按钮文案。连续更新会收敛到最新内容，减少动态效果时直接显示终态。示例使用本地计数模拟上传，不发送文件。

::animated-text-motion-example
::

:::

:::section{id="props" class="doc-section"}
## 属性

::docs-api-table{name="props"}
::

:::

:::section{id="slots-types" class="doc-section"}
## 插槽与公开类型

通过组件 ref 的 play(origin?) 手动播放一次；origin 接收 { clientX, clientY }，也可以直接传入鼠标或指针事件。公开类型 BingAnimatedTextExpose 与 BingAnimatedTextPlayOrigin 从包根入口导入。没有 pause/restart 或完成事件；无需为普通文案变化更换 key。

::docs-api-table{name="slots"}
::

::docs-api-table{name="types"}
::

:::

::::
