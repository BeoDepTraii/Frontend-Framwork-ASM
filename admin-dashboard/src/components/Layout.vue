<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <Sidebar :isLoggedIn="isLoggedIn" @login="openLoginModal" @logout="logout" />

    <div class="content">
      <!-- Header -->
      <Header :isLoggedIn="isLoggedIn" :userName="userName" @login="openLoginModal" @logout="logout" />

      <!-- Content -->
      <div class="container-fluid mt-4">
        <router-view />
      </div>

      <!-- Footer -->
      <Footer />

      <!-- Modal Login -->
      <div v-if="showLoginModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Login</h3>
          <form @submit.prevent="handleLogin">
            <!-- Username -->
            <div class="mb-3">
              <label for="login-username" class="form-label">Username</label>
              <input
                id="login-username"
                v-model="loginForm.username"
                class="form-control"
                placeholder="Enter Username"
                required
              />
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label for="login-password" class="form-label">Password</label>
              <input
                id="login-password"
                v-model="loginForm.password"
                type="password"
                class="form-control"
                placeholder="Enter Password"
                required
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="text-danger mb-3">
              {{ errorMessage }}
            </div>

            <!-- Buttons -->
            <div class="modal-buttons">
              <button type="submit" class="btn btn-primary">
                Login
              </button>
              <button type="button" @click="closeLoginModal" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from 'axios';

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Header,
    Footer,
  },
  setup() {
    // State
    const showLoginModal = ref(false);
    const loginForm = reactive({
      username: '',
      password: '',
    });
    const errorMessage = ref('');
    const isLoggedIn = ref(false);
    const userName = ref('');
    
    const notyf = new Notyf({
      duration: 3000,
      position: { x: "right", y: "top" },
      dismissible: true,
    });

    // Lifecycle hook
    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        isLoggedIn.value = true;
        userName.value = JSON.parse(user).username;
      }
    });

    // Methods
    const openLoginModal = () => {
      showLoginModal.value = true;
    };

    const closeLoginModal = () => {
      showLoginModal.value = false;
      errorMessage.value = '';
    };

    const handleLogin = async () => {
      const { username, password } = loginForm;
      try {
        const response = await axios.get('http://localhost:3000/account');
        const users = response.data;
        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
          isLoggedIn.value = true;
          userName.value = user.username;
          localStorage.setItem('user', JSON.stringify(user));
          notyf.success('Login Successful!');
          closeLoginModal();
        } else {
          errorMessage.value = 'Invalid username or password';
          notyf.error('Invalid username or password');
        }
      } catch (error) {
        errorMessage.value = 'Something went wrong. Please try again.';
        notyf.error('Something went wrong. Please try again.');
      }
    };

    const logout = () => {
      isLoggedIn.value = false;
      userName.value = '';
      localStorage.removeItem('user');
      notyf.success('Logged out successfully!');
    };

    return {
      showLoginModal,
      loginForm,
      errorMessage,
      isLoggedIn,
      userName,
      notyf,
      openLoginModal,
      closeLoginModal,
      handleLogin,
      logout,
    };
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons .btn {
  width: 48%;
}

.text-danger {
  color: red;
}
</style>
