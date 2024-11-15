<template>
  <div>
    <h2>Order Management</h2>
    <!-- Nút mở modal thêm đơn hàng -->
    <button class="btn btn-primary mb-4" @click="openAddModal">
      Add Order
    </button>

    <!-- Bảng đơn hàng -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th>Product</th>
          <th>Status</th>
          <th>Total</th>
          <th>Quantity</th>
          <th>Payment Method</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.user?.name || "Unknown Customer" }}</td>
          <td>{{ order.product?.name || "Unknown Product" }}</td>
          <td>
            <span :class="['status-badge', getStatusClass(order.status)]">{{
              order.status
            }}</span>
          </td>
          <td>{{ order.total }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.payment_method }}</td>
          <td>{{ formatDate(order.created_at) }}</td>
          <td>{{ formatDate(order.updated_at) }}</td>
          <td>
            <button @click="editOrder(order)" class="btn btn-primary btn-sm">
              Edit
            </button>
            <button
              @click="deleteOrder(order.id)"
              class="btn btn-danger btn-sm btnDele"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? "Edit Order" : "Add Order" }}</h3>
        <form @submit.prevent="handleSubmit">
          <!-- User ID -->
          <div class="mb-3">
            <label for="order-user-id" class="form-label">User ID</label>
            <input
              id="order-user-id"
              v-model="form.user_id"
              type="number"
              class="form-control"
              placeholder="Enter User ID"
            />
          </div>

          <!-- Product ID -->
          <div class="mb-3">
            <label for="order-product-id" class="form-label">Product ID</label>
            <input
              id="order-product-id"
              v-model="form.product_id"
              type="number"
              class="form-control"
              placeholder="Enter Product ID"
            />
          </div>

          <!-- Order Status -->
          <div class="mb-3">
            <label for="order-status" class="form-label">Order Status</label>
            <select
              id="order-status"
              v-model="form.status"
              class="form-control"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <!-- Total -->
          <div class="mb-3">
            <label for="order-total" class="form-label">Total</label>
            <div class="input-group">
              <input
                id="order-total"
                v-model.number="form.total"
                type="number"
                class="form-control"
                placeholder="Enter Total"
              />
              <span class="input-group-text">VND</span>
            </div>
          </div>

          <!-- Quantity -->
          <div class="mb-3">
            <label for="order-quantity" class="form-label">Quantity</label>
            <input
              id="order-quantity"
              v-model.number="form.quantity"
              type="number"
              class="form-control"
              placeholder="Enter Quantity"
            />
          </div>

          <!-- Payment Method -->
          <div class="mb-3">
            <label for="order-payment-method" class="form-label"
              >Payment Method</label
            >
            <select
              id="order-payment-method"
              v-model="form.payment_method"
              class="form-control"
            >
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="modal-buttons">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? "Update Order" : "Add Order" }}
            </button>
            <button type="button" @click="closeModal" class="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf({
  position: { x: "right", y: "top" },
  duration: 3000,
});

export default {
  setup() {
    const orders = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const editId = ref(null);

    const form = reactive({
      id: null,
      user_id: null,
      product_id: null,
      status: "pending",
      total: 0,
      quantity: 0,
      payment_method: "online",
      created_at: "",
      updated_at: "",
    });

    const fetchOrders = async () => {
      try {
        const ordersResponse = await axios.get("http://localhost:3000/orders");
        const usersResponse = await axios.get("http://localhost:3000/users");
        const productsResponse = await axios.get(
          "http://localhost:3000/products"
        );

        const usersMap = new Map(
          usersResponse.data.map((user) => [parseInt(user.id), user])
        );
        const productsMap = new Map(
          productsResponse.data.map((product) => [
            parseInt(product.id),
            product,
          ])
        );

        orders.value = ordersResponse.data.map((order) => ({
          ...order,
          user: usersMap.get(order.user_id) || { name: "Unknown Customer" },
          product: productsMap.get(order.product_id) || {
            name: "Unknown Product",
          },
        }));
      } catch (error) {
        notyf.error("Failed to fetch orders.");
      }
    };

    const deleteOrder = async (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (!confirmed) return;

      try {
        await axios.delete(`http://localhost:3000/orders/${id}`);
        fetchOrders();
        notyf.success("Order deleted successfully.");
      } catch (error) {
        notyf.error("Failed to delete order.");
      }
    };

    const openAddModal = () => {
      resetForm();
      isEditing.value = false;
      form.id = getNextId();
      showModal.value = true;
    };

    const editOrder = (order) => {
      Object.assign(form, order);
      isEditing.value = true;
      editId.value = order.id;
      showModal.value = true;
    };

    const addOrder = async () => {
      if (!validateForm()) return;

      try {
        const newOrder = {
          ...form,
          id: String(getNextId()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        await axios.post("http://localhost:3000/orders", newOrder);
        fetchOrders();
        closeModal();
        notyf.success("Order added successfully.");
      } catch (error) {
        notyf.error("Failed to add order.");
      }
    };

    const updateOrder = async () => {
      if (!validateForm()) return;

      try {
        const updatedOrder = {
          ...form,
          updated_at: new Date().toISOString(),
        };
        await axios.put(
          `http://localhost:3000/orders/${editId.value}`,
          updatedOrder
        );
        fetchOrders();
        closeModal();
        notyf.success("Order updated successfully.");
      } catch (error) {
        notyf.error("Failed to update order.");
      }
    };

    const validateForm = () => {
      if (!form.user_id || !form.product_id || !form.total || !form.quantity) {
        notyf.error("All fields are required.");
        return false;
      }
      return true;
    };

    const getNextId = () => {
      return orders.value.length > 0
        ? String(
            Math.max(...orders.value.map((order) => parseInt(order.id, 10))) + 1
          )
        : "1";
    };

    const handleSubmit = () => {
      if (isEditing.value) {
        updateOrder();
      } else {
        addOrder();
      }
    };

    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      form.id = null;
      form.user_id = null;
      form.product_id = null;
      form.status = "pending";
      form.total = 0;
      form.quantity = 0;
      form.payment_method = "online";
      form.created_at = "";
      form.updated_at = "";
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };

    const getStatusClass = (status) => {
      return status === "completed"
        ? "badge-success"
        : status === "canceled"
        ? "badge-danger"
        : "badge-warning";
    };

    onMounted(fetchOrders);

    return {
      orders,
      showModal,
      isEditing,
      form,
      fetchOrders,
      deleteOrder,
      openAddModal,
      editOrder,
      handleSubmit,
      closeModal,
      formatDate,
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

.badge-warning {
  background-color: #ffc107;
  color: #212529;
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
