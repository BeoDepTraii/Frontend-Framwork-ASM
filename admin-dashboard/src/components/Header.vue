<template>
  <nav class="navbar navbar-dark bg-primary shadow px-4">
    <a class="navbar-brand text-white" href="#">Admin Dashboard</a>
    <div>
      <button class="btn btn-light btn-sm">Profile</button>
    </div>
  </nav>
</template>

<script>
export default {
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
