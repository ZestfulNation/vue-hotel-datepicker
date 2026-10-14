import { createApp, createSSRApp } from 'vue'
import App from './App.vue'

const el = document.getElementById('app')
// The production build ships pre-rendered HTML, so hydrate it. The dev server serves an empty #app.
const prerendered = el.hasChildNodes()
const initialView = el.dataset.view || 'examples'

;(prerendered ? createSSRApp : createApp)(App, { initialView }).mount(el)
