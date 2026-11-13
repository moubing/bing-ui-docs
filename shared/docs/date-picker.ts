import type { DocsApiTables } from './types'

export const datePickerApi: DocsApiTables = {
  "value": {
    "headers": [
      "类型",
      "默认 valueFormat",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "date",
        "'YYYY-MM-DD'",
        "单值示例：'2026-07-01'；范围示例：['2026-07-01', '2026-07-15']。"
      ],
      [
        "datetime",
        "'YYYY-MM-DD HH:mm:ss'",
        "包含日期和时间，需要点击确定后提交。"
      ],
      [
        "month",
        "'YYYY-MM'",
        "按月份归一化，选择月份后单值会直接提交。"
      ],
      [
        "year",
        "'YYYY'",
        "按年份归一化，选择年份后单值会直接提交。"
      ],
      [
        "time",
        "'HH:mm:ss'",
        "内部会归一到 '2000-01-01'，只对外输出时间字符串。"
      ]
    ]
  },
  "expose": {
    "headers": [
      "方法",
      "类型",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "focus()",
        "() => void",
        "挂载后聚焦触发器。"
      ],
      [
        "blur()",
        "() => void",
        "移除触发器焦点。"
      ],
      [
        "openPanel()",
        "() => void",
        "打开并把焦点移到面板；禁用或已打开时无操作。返回 void，不是动画 Promise。"
      ],
      [
        "closePanel()",
        "() => void",
        "关闭，不发 cancel、confirm 或提交草稿，也不主动把焦点移回触发器。"
      ],
      [
        "clear()",
        "() => void",
        "满足 clearable、未禁用、有值后提交 null；建议先 closePanel() 再清空，防止已打开面板保留旧草稿。"
      ]
    ]
  },
  "props": {
    "headers": [
      "属性",
      "类型",
      "默认值",
      "说明"
    ],
    "codeColumns": 3,
    "rows": [
      [
        "id",
        "string",
        "自动生成 / FormItem controlId",
        "应用到触发按钮；默认生成唯一值，FormItem 内自动关联字段标签。"
      ],
      [
        "modelValue",
        "BingDatePickerModelValue",
        "null",
        "单值 string | null，范围为完整 [string, string] | null。组件始终提交字符串，不提交原生 Date。"
      ],
      [
        "type",
        "BingDatePickerType",
        "'date'",
        "date、datetime、month、year、time，决定面板与默认 valueFormat。"
      ],
      [
        "range",
        "boolean",
        "false",
        "五种类型均可选择范围，完整有效的两端才能确认。"
      ],
      [
        "placeholder",
        "string",
        "undefined",
        "单值空态，未传时显示“请选择日期”。"
      ],
      [
        "startPlaceholder",
        "string",
        "'开始'",
        "范围起点空态。"
      ],
      [
        "endPlaceholder",
        "string",
        "'结束'",
        "范围终点空态。"
      ],
      [
        "disabled",
        "boolean",
        "undefined（继承 Form，否则 false）",
        "未设置时继承 Form，最终默认 false，显式 false 可覆盖继承；阻止打开与清空，但当前仍不会自动关闭已打开的面板，详见正文。"
      ],
      [
        "clearable",
        "boolean",
        "true",
        "有值且未禁用时显示清除按钮，也是 clear() 的执行条件。"
      ],
      [
        "size",
        "BingDatePickerSize",
        "undefined（继承 FormItem / Form / ConfigProvider，否则 md）",
        "触发器高度依次为 32/36/40px。"
      ],
      [
        "block",
        "boolean",
        "false",
        "撑满容器，FormItem 内自动开启。"
      ],
      [
        "minWidth",
        "string | number",
        "220",
        "数字按 px，字符串作为 CSS 长度；数字字符串不自动补单位。"
      ],
      [
        "format",
        "string",
        "undefined（使用 valueFormat）",
        "仅影响展示，不改变保存值。"
      ],
      [
        "valueFormat",
        "string",
        "按 type 决定，见值格式表",
        "严格解析 modelValue/min/max 并格式化提交值，建议常用 Dayjs 格式标记。"
      ],
      [
        "locale",
        "string",
        "'zh-CN'",
        "Intl.DateTimeFormat 使用的日历月份、年月标题及星期语言；操作按钮与快捷文案仍为中文。"
      ],
      [
        "firstDayOfWeek",
        "number",
        "1",
        "周起始日，建议 0–6 的有限整数；0 为周日。"
      ],
      [
        "min",
        "string",
        "undefined",
        "最小允许值，按 valueFormat 严格解析；解析失败忽略该限制。"
      ],
      [
        "max",
        "string",
        "undefined",
        "最大允许值，按 valueFormat 严格解析；上下界包含边界。"
      ],
      [
        "disabledDate",
        "(value: Dayjs, context: BingDatePickerDisabledDateContext) => boolean",
        "undefined",
        "日期、月份、年份的禁用判断；time 类型不调用。范围只验证端点。"
      ],
      [
        "disabledTime",
        "(value: Dayjs, context: BingDatePickerDisabledTimeContext) => boolean",
        "undefined",
        "datetime/time 的候选时间判断，包含角色、单位与候选数值。"
      ],
      [
        "hourStep",
        "number",
        "1",
        "小时选项间隔，建议正的有限整数；仅限制列表，不校验外部值是否为步进倍数。"
      ],
      [
        "minuteStep",
        "number",
        "1",
        "分钟选项间隔。"
      ],
      [
        "secondStep",
        "number",
        "1",
        "秒选项间隔。"
      ],
      [
        "smoothScroll",
        "SmoothScrollValue",
        "true",
        "仅时、分、秒列表使用；false 关闭组件插值，配置见下表。"
      ],
      [
        "showShortcuts",
        "boolean",
        "true",
        "显示内置快捷操作，无法传入自定义列表；侧边空间不足时快捷区移入面板内。"
      ],
      [
        "panelMaxHeight",
        "string | number",
        "420",
        "面板 CSS 最大高度，数字按 px。"
      ],
      [
        "ariaLabel",
        "string",
        "undefined",
        "触发按钮可访问名称。"
      ],
      [
        "ariaDescribedby",
        "string",
        "undefined",
        "与 FormItem 描述 id 合并。"
      ],
      [
        "status",
        "'default' | 'error' | 'success' | 'warning'",
        "undefined（继承 FormItem，否则 default）",
        "样式状态，error 使触发器 aria-invalid=true。"
      ],
      [
        "glass",
        "boolean",
        "true",
        "玻璃效果。"
      ],
      [
        "glassBlur",
        "string | number",
        "undefined（主题默认 16）",
        "模糊 CSS 长度，数字按 px；省略时跟随主题。"
      ],
      [
        "glassOpacity",
        "number",
        "undefined（浅色 0.86 / 深色 0.92）",
        "玻璃底色不透明度，省略时跟随主题。"
      ],
      [
        "glassSaturation",
        "number",
        "undefined（主题默认 1.05）",
        "玻璃饱和度，省略时跟随主题。"
      ]
    ]
  },
  "events": {
    "headers": [
      "事件",
      "参数",
      "说明"
    ],
    "codeColumns": 2,
    "rows": [
      [
        "update:modelValue",
        "BingDatePickerModelValue",
        "提交时先发送；外部赋值不触发。相同值也可能再次提交。"
      ],
      [
        "change",
        "BingDatePickerChangePayload",
        "更新模型后发送，包含 value、parsedValue、type、range。"
      ],
      [
        "clear",
        "无",
        "满足清空条件时最先发送，随后 update:modelValue(null)、change；不自动关闭面板。"
      ],
      [
        "open",
        "无",
        "打开时发送，动画尚未结束。"
      ],
      [
        "close",
        "无",
        "请求关闭时发送，不代表动画结束。"
      ],
      [
        "confirm",
        "BingDatePickerChangePayload",
        "点击确定或成功使用快捷操作时，在 change 后、close 前发送。单值 date/month/year 点单元格不会发送。"
      ],
      [
        "cancel",
        "无",
        "面板内 Escape 或取消按钮触发，然后 close；外部点击、触发器收起或 closePanel() 只发送 close。"
      ]
    ]
  },
  "types": {
    "headers": [
      "公开类型",
      "定义或用途"
    ],
    "codeColumns": 1,
    "rows": [
      [
        "BingDatePickerType",
        "'date' | 'datetime' | 'month' | 'year' | 'time'"
      ],
      [
        "BingDatePickerSize",
        "'sm' | 'md' | 'lg'"
      ],
      [
        "BingDatePickerSingleValue",
        "string | null"
      ],
      [
        "BingDatePickerRangeValue",
        "[string, string] | null"
      ],
      [
        "BingDatePickerModelValue",
        "BingDatePickerSingleValue | BingDatePickerRangeValue"
      ],
      [
        "BingDatePickerRangeRole",
        "'start' | 'end'"
      ],
      [
        "BingDatePickerTimeUnit",
        "'hour' | 'minute' | 'second'"
      ],
      [
        "BingDatePickerDisabledDateContext",
        "{ type: BingDatePickerType; range: boolean; role?: BingDatePickerRangeRole }"
      ],
      [
        "BingDatePickerDisabledTimeContext",
        "BingDatePickerDisabledDateContext & { unit: BingDatePickerTimeUnit; value: number }"
      ],
      [
        "BingDatePickerChangePayload",
        "{ value: BingDatePickerModelValue; parsedValue: Dayjs | [Dayjs, Dayjs] | null; type: BingDatePickerType; range: boolean }"
      ],
      [
        "BingDatePickerProps",
        "上表 33 个可选属性，包含继承的玻璃效果属性。"
      ],
      [
        "BingDatePickerEmits",
        "上表 7 个事件及其参数。"
      ],
      [
        "BingDatePickerExpose",
        "上表 5 个返回 void 的实例方法。"
      ],
      [
        "Dayjs",
        "来自 dayjs 的日期对象，回调可使用 day()、hour()、format() 等。示例通过 BingDatePickerProps 的回调类型获取参数，不依赖额外运行时导入。"
      ],
      [
        "SmoothScrollValue",
        "boolean | SmoothScrollOptions"
      ],
      [
        "SmoothScrollOptions",
        "下表可选配置；DatePicker 默认关闭 keyboard、尊重减少动态效果且 smoothTouchpad=false。"
      ]
    ]
  },
  "smooth": {
    "headers": [
      "SmoothScrollOptions 字段",
      "类型",
      "默认值",
      "说明"
    ],
    "codeColumns": 3,
    "rows": [
      [
        "duration",
        "number",
        "400",
        "动画时长，毫秒；0 立即更新。"
      ],
      [
        "stepSize",
        "number",
        "100",
        "滚轮归一化步长。"
      ],
      [
        "pulseScale",
        "number",
        "4",
        "脉冲缓动强度。"
      ],
      [
        "accelerationDelta",
        "number",
        "50",
        "连续输入加速间隔，毫秒。"
      ],
      [
        "accelerationMax",
        "number",
        "3",
        "最大加速倍率。"
      ],
      [
        "keyboardStep",
        "number",
        "50",
        "键盘基础滚动距离。"
      ],
      [
        "keyboard",
        "boolean",
        "false",
        "内部滚动区的键盘插值。"
      ],
      [
        "smoothTouchpad",
        "boolean",
        "false",
        "是否对触控板应用插值。"
      ],
      [
        "respectReducedMotion",
        "boolean",
        "true",
        "减少动态效果偏好下关闭插值。"
      ]
    ]
  }
}
