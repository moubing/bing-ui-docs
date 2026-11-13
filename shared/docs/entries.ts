/** 对外入口只指向生产环境；测试站不进入导航。 */
export const publicEntries = {
  docs: 'https://101.35.217.21:6008',
  storybook: 'https://101.35.217.21:6007',
} as const
