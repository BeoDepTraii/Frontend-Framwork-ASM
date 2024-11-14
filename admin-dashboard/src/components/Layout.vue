<template>
    <div class="d-flex">
      <!-- Sidebar -->
      <Sidebar />
  
      <div class="flex-fill">
        <!-- Header -->
        <Header />
  
        <!-- Content -->
        <div class="container-fluid mt-4">
          <router-view />
        </div>
  
        <!-- Footer -->
        <Footer />
      </div>
    </div>
  </template>
  
  <script>
  import Sidebar from './Sidebar.vue'
  import Header from './Header.vue'
  import Footer from './Footer.vue'
  
  export default {
    name: "Layout",
    components: {
      Sidebar,
      Header,
      Footer,
    },
  };
  </script>
  
  <style scoped>
  /* Các style riêng cho Layout nếu cần */
  </style>
  