import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: () => import('./../pages/Upload.vue'),
      meta: {
        title: '作业提交系统'
      }
    },
    {
      path: '/stat',
      component: () => import('./../pages/Stat.vue'),
      meta: {
        title: '作业统计系统'
      }
    }
  ]
})