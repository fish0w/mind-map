import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from "core-js/internals/queue";

Vue.use(VueRouter)

const routes = [
    {
    path: '/',
    name: 'MainPage',
    component: () => import(`./pages/MainPage`)
  },
    {
    path: '/edit',
    name: 'Edit',
    component: () => import(`./pages/Edit/Index.vue`)
  },
    {
    path: '/md',
    name: 'md',
    component: () => import(`./pages/Edit/components/MockMdGenerator.vue`)
  },
  {
    path: '/index',
    redirect: '/'
  },
  {
    path: '/doc/zh',
    component: () => import(`./pages/Doc.vue`)
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach(async (to, from, next) => {
  const member = to.query.member;
  try {
    const response = await axios.get('https://shuitunai.cn/check', {
      params: { member }
    });
    if (response.data.is_member) {
      next();
    } else {
      next({ path: '/login', query: { error: true } });
    }
  } catch (error) {
    next('/error');
  }
});

export default router
