import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('./../pages/Upload.vue')
    },
    {
      path: '/stat',
      component: () => import('./../pages/Stat.vue')
    }
  ]
})