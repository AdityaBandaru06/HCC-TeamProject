import Vue from 'vue'
import VueRouter from 'vue-router'
import Settings from '../views/Settings.vue'
import Alert from '../views/Alert.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/alert',
    name: 'Alert',
    component: Alert
  },
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router