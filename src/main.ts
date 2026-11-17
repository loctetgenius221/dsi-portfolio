import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vReveal } from './directives/reveal'
import { vSplit } from './directives/split'

const app = createApp(App)

app.use(router)
app.directive('reveal', vReveal)
app.directive('split', vSplit)

app.mount('#app')
