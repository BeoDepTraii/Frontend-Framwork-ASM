<template>
    <div>
      <h2>Product Management</h2>
      <button @click="addProduct">Add Product</button>
      <table class="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button @click="editProduct(product.id)" class="btn btn-primary btn-sm">Edit</button>
              <button @click="deleteProduct(product.id)" class="btn btn-danger btn-sm">Delete</button>
            </td>
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
        products: []
      };
    },
    created() {
      this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await axios.get('http://localhost:3000/products');
          this.products = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async deleteProduct(id) {
        try {
          await axios.delete(`http://localhost:3000/products/${id}`);
          this.fetchProducts();
        } catch (error) {
          console.error(error);
        }
      },
      addProduct() {
        // Handle add product functionality here
        alert('Add product functionality is not yet implemented.');
      },
      editProduct(id) {
        // Handle edit product functionality here
        alert(`Edit product functionality for product ID: ${id} is not yet implemented.`);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Custom styles for product management */
  table {
    width: 100%;
  }
  </style>
  