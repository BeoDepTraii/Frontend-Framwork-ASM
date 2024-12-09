<template>
  <div>
    <h2>User Management</h2>
    <!-- Nút mở modal thêm người dùng -->
    <button class="btn btn-primary mb-4" @click="openAddModal">Add User</button>

    <!-- Bảng người dùng -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td><img :src="user.img" alt="User Image" style="width: 50px; height: auto;" /></td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span :class="['status-badge', getStatusClass(user.status)]">{{ user.status }}</span>
          </td>
          <td>
            <button @click="editUser(user)" class="btn btn-primary btn-sm">Edit</button>
            <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm btnDele">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

<!-- Modal -->
<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h3>{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
    <form @submit.prevent="handleSubmit">
      <!-- Input for ID -->
      <div class="mb-3">
        <label for="user-id" class="form-label">ID</label>
        <input id="user-id" v-model="form.id" class="form-control" placeholder="Enter ID" disabled />
      </div>
      
      <!-- Input for Name -->
      <div class="mb-3">
        <label for="user-name" class="form-label">Name</label>
        <input id="user-name" v-model="form.name" class="form-control" placeholder="Enter Name" :disabled="isEditing" />
      </div>
      
      <!-- Input for Image URL -->
      <div class="mb-3">
        <label for="user-img" class="form-label">Image URL</label>
        <input id="user-img" v-model="form.img" class="form-control" placeholder="Enter Image URL" :disabled="isEditing" />
      </div>
      
      <!-- Input for Email -->
      <div class="mb-3">
        <label for="user-email" class="form-label">Email</label>
        <div class="input-group">
          <input id="user-email" v-model="form.email" type="text" class="form-control" placeholder="Enter Email" :disabled="isEditing" />
          <span class="input-group-text">@example.com</span>
        </div>
      </div>
      
      <!-- Input for Phone -->
      <div class="mb-3">
        <label for="user-phone" class="form-label">Phone Number</label>
        <input id="user-phone" v-model="form.phone" class="form-control" placeholder="Enter Phone Number" :disabled="isEditing" />
      </div>
      
      <!-- Select for Role -->
      <div class="mb-3">
        <label for="user-role" class="form-label">Role</label>
        <div class="select-wrapper">
        <select id="user-role" v-model="form.role" class="form-control">
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <span class="dropdown-icon">▼</span>
      </div>
      </div>
      
      <!-- Select for Status -->
      <div class="mb-3">
        <label for="user-status" class="form-label">Status</label>
        <div class="select-wrapper">
        <select id="user-status" v-model="form.status" class="form-control">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <span class="dropdown-icon">▼</span>
      </div>
      </div>
      
      <!-- Buttons -->
      <div class="modal-buttons">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update User' : 'Add User' }}</button>
        <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
      </div>
    </form>
  </div>
</div>

  </div>
</template>


<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  position: { x: 'right', y: 'top' },
  duration: 3000,
});

export default {
  setup() {
    const users = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const form = reactive({
      id: "",
      name: "",
      img: "",
      email: "",
      phone: "",
      role: "user",
      status: "active",
    });

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        users.value = response.data.map(user => ({ ...user, id: String(user.id) }));
      } catch (error) {
        notyf.error("Failed to fetch users.");
      }
    };

    const deleteUser = async (id) => {
      const confirmed = window.confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;
      
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        fetchUsers();
        notyf.success("User deleted successfully.");
      } catch (error) {
        notyf.error("Failed to delete user.");
      }
    };

    const openAddModal = () => {
      resetForm();
      isEditing.value = false;
      form.id = getNextId();
      showModal.value = true;
    };

    const editUser = (user) => {
      Object.assign(form, user);
      isEditing.value = true;
      showModal.value = true;
    };

    const updateUser = async () => {
      try {
        const updatedData = { role: form.role, status: form.status };
        await axios.patch(`http://localhost:3000/users/${form.id}`, updatedData);
        fetchUsers();
        closeModal();
        notyf.success("User updated successfully.");
      } catch (error) {
        notyf.error("Failed to update user.");
      }
    };

    const addUser = async () => {
      if (!validateForm()) return;
      try {
        const newUser = { ...form, id: String(getNextId()) };
        await axios.post("http://localhost:3000/users", newUser);
        fetchUsers();
        closeModal();
        notyf.success("User added successfully.");
      } catch (error) {
        notyf.error("Failed to add user.");
      }
    };

    const validateForm = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,15}$/;

      if (!form.name || !form.img || !form.email || !form.phone) {
        notyf.error("All fields are required.");
        return false;
      }
      if (!emailRegex.test(form.email)) {
        notyf.error("Invalid email format.");
        return false;
      }
      if (!phoneRegex.test(form.phone)) {
        notyf.error("Invalid phone number.");
        return false;
      }
      return true;
    };

    const getNextId = () => {
      return users.value.length > 0
        ? String(Math.max(...users.value.map(user => parseInt(user.id, 10))) + 1)
        : "1";
    };

    const handleSubmit = () => {
      if (isEditing.value) {
        updateUser();
      } else {
        addUser();
      }
    };

    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      form.id = "";
      form.name = "";
      form.img = "";
      form.email = "";
      form.phone = "";
      form.role = "user";
      form.status = "active";
    };

    const getStatusClass = (status) => {
      return status === "active" ? "badge-success" : "badge-danger";
    };

    onMounted(fetchUsers);

    return {
      users,
      showModal,
      isEditing,
      form,
      fetchUsers,
      deleteUser,
      openAddModal,
      editUser,
      handleSubmit,
      closeModal,
      getStatusClass,
    };
  },
};
</script>




<style scoped>
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Trạng thái */
.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  text-transform: capitalize;
}

.badge-success {
  background-color: #28a745;
}

.badge-danger {
  background-color: #dc3545;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.btnDele {
  margin-left: 0.3em;
}
</style>
