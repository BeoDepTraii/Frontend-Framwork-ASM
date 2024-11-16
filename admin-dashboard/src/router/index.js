import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../components/Layout.vue';
import Products from '../components/ProductManage.vue';
import Users from '../components/UserManage.vue';
import Orders from '../components/OrderManage.vue';
import Dashboard from '../components/Dashboard.vue';

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
      },
      {
        path: '/dashboard',
        component: Dashboard,
      },
      {
        path: '',
        component: Dashboard,
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
