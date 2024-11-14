<template>
  <div class="bg-dark text-white p-3" style="height: 100vh;">
    <h2 class="text-center mb-4">Dashboard</h2>
    <ul class="nav flex-column">
      <li class="nav-item">
        <router-link to="/products" class="nav-link text-white">Sản Phẩm</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/users" class="nav-link text-white">Người Dùng</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/orders" class="nav-link text-white">Đơn Hàng</router-link>
      </li>
      <li class="nav-item">
        <!-- <router-link to="/statistics" class="nav-link text-white">Thống Kê</router-link> -->
      </li>
    </ul>
  </div>
</template>

  
  <script>
  export default {
    name: 'Sidebar'
  };
  </script>
  
  <style scoped>
  /* Optional additional styles */
  </style>
  