import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'

export function render(initialView) {
  return renderToString(createSSRApp(App, { initialView }))
}
