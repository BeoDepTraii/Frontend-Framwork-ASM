<template>
  <div class="sidebar bg-dark text-white p-3">
    <h4 class="text-center mb-4">Menu</h4>
    <ul class="nav flex-column">
      <li class="nav-item mb-2">
        <router-link to="/dashboard" class="nav-link text-white">Dashboard</router-link>
      </li>
      <li class="nav-item mb-2">
        <router-link to="/products" class="nav-link text-white">Products</router-link>
      </li>
      <li class="nav-item mb-2">
        <router-link to="/users" class="nav-link text-white">Users</router-link>
      </li>
      <li class="nav-item mb-2">
        <router-link to="/orders" class="nav-link text-white">Orders</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
}

.nav-link {
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.nav-link:hover {
  background-color: #495057;
  text-decoration: none;
}
</style>
