import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import DocPage from '@/pages/Doc/Index';
import routerList from '@/pages/Doc/routerList';

import LoginComponent from '@/components/views/LoginComponent.vue';
import ErrorComponent from '@/components/views/ErrorComponent.vue';

// 处理没有翻译的章节路由
const handleRouterList = () => {
  let zhList = routerList[0].children;
  for (let i = 1; i < routerList.length; i++) {
    let list = routerList[i].children;
    zhList.forEach(item => {
      if (!list.find((item2) => {
        return item2.path === item.path;
      })) {
        list.push({
          ...item,
          lang: 'zh'
        });
      }
    });
  }
}

handleRouterList();

// 创建路由列表
const createTypeRouterList = (type, redirectPath) => {
  return [
    ...routerList.map((item) => {
      return {
        path: `/${type}/${item.lang}/`,
        redirect: `/${type}/${item.lang}/${redirectPath}/`
      }
    }),
    ...routerList.map((item) => {
      return {
        path: `/${type}/${item.lang}/`,
        component: DocPage,
        children: item.children.map((child) => {
          return {
            path: `${child.path}/:h?`,
            component: () => import(`./pages/Doc/${child.lang || item.lang}/${child.path}/index.vue`)
          }
        })
      }
    })
  ]
}

Vue.use(VueRouter);

const routes = [
  {
    path: '/index',
    name: 'Index',
    component: () => import(`./pages/Index/Index.vue`)
  },
  {
    path: '/',
    name: 'Edit',
    component: () => import(`./pages/Edit/Index.vue`)
  },
  // 开发文档
  ...createTypeRouterList('doc', 'introduction'),
  // 帮助文档
  ...createTypeRouterList('help', 'help1'),
  // 新增的路由
  { path: '/login', component: LoginComponent },
  { path: '/error', component: ErrorComponent },
];

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  const member = to.query.member;
  try {
    const response = await axios.get('http://localhost:5001/check', {
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

export default router;