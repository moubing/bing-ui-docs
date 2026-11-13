import { readFileSync } from 'node:fs'
import { isAbsolute, join } from 'node:path'

/** 仅用于发版前验证；路径必须由调用方显式提供，默认使用发布包。 */
export function uiCandidate() {
  const directory = process.env.BING_UI_CANDIDATE_DIR
  if (!directory) return null
  if (!isAbsolute(directory)) throw new Error('BING_UI_CANDIDATE_DIR 必须为已核验的绝对路径')
  if (JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')).name !== '@moubing/bing-ui') throw new Error('候选目录不是 @moubing/bing-ui')
  const types = join(directory, 'dist/index.d.ts')
  readFileSync(types)
  const directoryPattern = directory.replaceAll('\\', '/').replace(/\/+$/, '').split('/')
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\\\/]')
  return {
    directory, types,
    alias: { '@moubing/bing-ui/style.css': join(directory, 'dist/bing-ui.css'), '@moubing/bing-ui': join(directory, 'dist/index.js') },
    // 外部构建产物也应按依赖处理，不能对压缩后的变量执行 Nuxt 自动导入。
    imports: { transform: { exclude: [/[\\/]node_modules[\\/]/, new RegExp(`^${directoryPattern}[\\\\/]dist[\\\\/]`)] } },
  }
}
