<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar />

    <div class="content">
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
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Header,
    Footer,
  },
};
</script>

<style scoped>
/* Chỉnh toàn bộ layout */
.container-fluid {
  padding: 20px;
}

/* Nội dung chính (tránh bị Sidebar chèn) */
.content {
  flex-grow: 1;
  margin-left: 250px; /* Phải khớp với width của Sidebar */
  min-height: 100vh;
}
</style>
