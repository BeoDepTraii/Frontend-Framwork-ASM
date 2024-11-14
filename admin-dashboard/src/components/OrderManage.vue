<template>
    <div>
      <h2>Order Management</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ getProductName(order.product_id) }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ order.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        orders: [],
        products: []
      };
    },
    created() {
      this.fetchOrders();
      this.fetchProducts();
    },
    methods: {
      async fetchOrders() {
        try {
          const response = await axios.get('http://localhost:3000/orders');
          this.orders = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async fetchProducts() {
        try {
          const response = await axios.get('http://localhost:3000/products');
          this.products = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      getProductName(productId) {
        const product = this.products.find(p => p.id === productId);
        return product ? product.name : 'Unknown';
      }
    }
  };
  </script>
  