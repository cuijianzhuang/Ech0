import 'virtual:uno.css'
import '@/themes/index.scss'

import { initStores } from './stores'

// Md-Editor Start - 使用懒加载优化首屏性能
import { config } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// 懒加载重型库的 Promise 缓存
let highlightPromise: Promise<typeof import('highlight.js')['default']> | null = null
let katexPromise: Promise<typeof import('katex')['default']> | null = null
let mermaidPromise: Promise<typeof import('mermaid')['default']> | null = null
let prettierPromise: Promise<typeof import('prettier')> | null = null
let parserMarkdownPromise: Promise<typeof import('prettier/plugins/markdown')['default']> | null = null
let cropperPromise: Promise<typeof import('cropperjs')['default']> | null = null
let screenfullPromise: Promise<typeof import('screenfull')['default']> | null = null

// 懒加载函数
const loadHighlight = () => {
  if (!highlightPromise) {
    highlightPromise = Promise.all([
      import('highlight.js'),
      import('highlight.js/styles/atom-one-dark.css'),
    ]).then(([mod]) => mod.default)
  }
  return highlightPromise
}

const loadKatex = () => {
  if (!katexPromise) {
    katexPromise = Promise.all([
      import('katex'),
      import('katex/dist/katex.min.css'),
    ]).then(([mod]) => mod.default)
  }
  return katexPromise
}

const loadMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((mod) => mod.default)
  }
  return mermaidPromise
}

const loadPrettier = () => {
  if (!prettierPromise) {
    prettierPromise = import('prettier')
  }
  return prettierPromise
}

const loadParserMarkdown = () => {
  if (!parserMarkdownPromise) {
    parserMarkdownPromise = import('prettier/plugins/markdown').then((mod) => mod.default)
  }
  return parserMarkdownPromise
}

const loadCropper = () => {
  if (!cropperPromise) {
    cropperPromise = import('cropperjs').then((mod) => mod.default)
  }
  return cropperPromise
}

const loadScreenfull = () => {
  if (!screenfullPromise) {
    screenfullPromise = import('screenfull').then((mod) => mod.default)
  }
  return screenfullPromise
}

// 配置 md-editor-v3 使用懒加载
config({
  editorExtensions: {
    prettier: {
      prettierInstance: loadPrettier,
      parserMarkdownInstance: loadParserMarkdown,
    },
    highlight: {
      instance: loadHighlight,
    },
    screenfull: {
      instance: loadScreenfull,
    },
    katex: {
      instance: loadKatex,
    },
    cropper: {
      instance: loadCropper,
    },
    mermaid: {
      instance: loadMermaid,
    },
  },
  codeMirrorExtensions(extensions) {
    return [
      // 移除 linkShortener
      ...extensions.filter((ext) => ext.type !== 'linkShortener'),
    ]
  },
})

// Md-Editor End

// 自定义组件
import BaseDialog from '@/components/common/BaseDialog.vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// init
await initStores().catch((e) => {
  console.error('Failed to initialize stores:', e)
})

app.use(router)

// 全局注册组件
app.component('BaseDialog', BaseDialog)

app.mount('#app')

// 移除启动加载动画
const appLoader = document.getElementById('app-loader')
if (appLoader) {
  appLoader.remove()
}
