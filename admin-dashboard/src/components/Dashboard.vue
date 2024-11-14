<template>
    <div>
      <h2>Dashboard</h2>
      <div>
        <p>Total Users: {{ totalUsers }}</p>
        <p>Total Products: {{ totalProducts }}</p>
        <p>Total Orders: {{ totalOrders }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const usersResponse = await axios.get('http://localhost:3000/users');
          const productsResponse = await axios.get('http://localhost:3000/products');
          const ordersResponse = await axios.get('http://localhost:3000/orders');
  
          this.totalUsers = usersResponse.data.length;
          this.totalProducts = productsResponse.data.length;
          this.totalOrders = ordersResponse.data.length;
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  </script>
  