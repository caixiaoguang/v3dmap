import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCesium from 'vue-cesium'

import './styles/main.less'
import 'normalize.css'

const app = createApp(App).use(router);
app.use(VueCesium);
app.mount('#app');
