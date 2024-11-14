import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../components/Layout.vue';
import Products from '../components/ProductManage.vue';
import Users from '../components/UserManage.vue';
import Orders from '../components/OrderManage.vue';
// import Statistics from '../components/Statistics.vue';

const routes = [
  {
    path: '/',
    name: 'layout',
    component: Layout,
    children: [
      {
        path: '/products',
        component: Products,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/orders',
        component: Orders,
      }
    //   {
    //     path: '/statistics',
    //     component: Statistics,
    //   }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
