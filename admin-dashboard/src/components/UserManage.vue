<template>
    <div>
      <h2>Manage Users</h2>
      <button @click="addUser">Add User</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="deleteUser(user.id)">Delete</button>
              <button @click="editUser(user.id)">Edit</button>
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
        users: []
      };
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await axios.get('http://localhost:3000/users');
          this.users = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async deleteUser(id) {
        try {
          await axios.delete(`http://localhost:3000/users/${id}`);
          this.fetchUsers();
        } catch (error) {
          console.error(error);
        }
      },
      addUser() {
        // Handle add user functionality here
      },
      editUser(id) {
        // Handle edit user functionality here
      }
    }
  };
  </script>
  