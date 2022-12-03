import Vue from 'vue'
import VueRouter from 'vue-router'
import Settings from '../views/Settings.vue'
import Alert from '../views/Alert.vue'
import Home from '../views/Home.vue'
import AlertStop from '../views/AlertStop.vue'

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
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/alert-stop',
    name: 'AlertStop',
    component: AlertStop
  },
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router