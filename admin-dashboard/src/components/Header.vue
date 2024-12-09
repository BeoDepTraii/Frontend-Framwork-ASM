<template>
  <nav class="navbar navbar-dark bg-primary shadow px-4">
    <a class="navbar-brand text-white" href="#">Admin Dashboard</a>
    <div class="d-flex align-items-center">
      <!-- Hiển thị tên người dùng sau khi đăng nhập -->
      <span v-if="isLoggedIn" class="text-white" style="margin-right: 10px;">Hello, {{ userName }}! </span>

      <button @click="$emit('logout')" v-if="isLoggedIn" class="btn btn-danger">
        Logout
      </button>
      <button @click="$emit('login')" v-if="!isLoggedIn" class="btn btn-primary">
        Login
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  props: ['isLoggedIn', 'userName'],
  name: 'Header',
};
</script>

<style scoped>
/* Header styling */
.navbar {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
