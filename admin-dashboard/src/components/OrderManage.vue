<template>
  <div>
    <h2>Order Management</h2>
    <button class="btn btn-primary mb-4" @click="openAddModal">
      Add Order
    </button>

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
          <td>
            <span class="ellipsis" :title="order.product?.name">{{
              order.product?.name || "Unknown Product"
            }}</span>
          </td>
          <td>
            <span :class="['status-badge', getStatusClass(order.status)]">{{
              order.status
            }}</span>
          </td>
          <td>{{ formatPrice(order.total) }}</td>
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
      <!-- User Select -->
      <div class="mb-3">
        <label for="order-user-id" class="form-label">Customer</label>
        <div class="select-wrapper">
          <select
            v-model="form.user_id"
            id="order-user-id"
            class="form-control"
          >
            <option
              v-for="user in users.filter((u) => u.status === 'active')"
              :key="user.id"
              :value="user.id"
            >
              {{ user.name }}
            </option>
          </select>
          <span class="dropdown-icon">▼</span> <!-- Mũi tên xuống -->
        </div>
      </div>

      <!-- Product Select -->
      <div class="mb-3">
        <label for="order-product-id" class="form-label">Product</label>
        <div class="select-wrapper">
          <select
            v-model="form.product_id"
            id="order-product-id"
            class="form-control"
          >
            <option
              v-for="product in products.filter(
                (p) => p.status === 'active' && p.quantity > 0
              )"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
          <span class="dropdown-icon">▼</span> <!-- Mũi tên xuống -->
        </div>
      </div>

      <!-- Other Fields -->
      <div class="mb-3">
        <label for="order-status" class="form-label">Order Status</label>
        <div class="select-wrapper">
          <select
            id="order-status"
            v-model="form.status"
            class="form-control"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <span class="dropdown-icon">▼</span> <!-- Mũi tên xuống -->
        </div>
      </div>

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

      <div class="mb-3">
        <label for="order-payment-method" class="form-label">Payment Method</label>
        <div class="select-wrapper">
          <select
            id="order-payment-method"
            v-model="form.payment_method"
            class="form-control"
          >
            <option value="online">Online</option>
            <option value="cash">Cash</option>
          </select>
          <span class="dropdown-icon">▼</span> <!-- Mũi tên xuống -->
        </div>
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
    const users = ref([]);
    const products = ref([]);
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

    const fetchData = async () => {
      try {
        const [ordersResponse, usersResponse, productsResponse] =
          await Promise.all([
            axios.get("http://localhost:3000/orders"),
            axios.get("http://localhost:3000/users"),
            axios.get("http://localhost:3000/products"),
          ]);

        users.value = usersResponse.data;
        products.value = productsResponse.data;

        const usersMap = new Map(
          users.value.map((user) => [parseInt(user.id), user])
        ); // Đảm bảo id là kiểu số
        const productsMap = new Map(
          products.value.map((product) => [parseInt(product.id), product])
        ); // Đảm bảo id là kiểu số

        orders.value = ordersResponse.data.map((order) => ({
          ...order,
          user: usersMap.get(parseInt(order.user_id)) || {
            name: "Unknown Customer",
          }, // Chuyển user_id về kiểu số
          product: productsMap.get(parseInt(order.product_id)) || {
            name: "Unknown Product",
          }, // Chuyển product_id về kiểu số
        }));
      } catch (error) {
        notyf.error("Failed to fetch data.");
      }
    };

    const deleteOrder = async (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (!confirmed) return;

      try {
        await axios.delete(`http://localhost:3000/orders/${id}`);
        fetchData();
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
      // Kiểm tra trạng thái của người dùng và sản phẩm trước khi thêm đơn hàng
      const user = users.value.find((u) => u.id === form.user_id);
      const product = products.value.find((p) => p.id === form.product_id);

      if (user?.status !== "active") {
        notyf.error("Customer is inactive.");
        return;
      }

      if (product?.status !== "active" || product.quantity <= 0) {
        notyf.error("Product is either inactive or out of stock.");
        return;
      }
      try {
        const user = users.value.find((u) => u.id === form.user_id);
        const product = products.value.find((p) => p.id === form.product_id);

        // Xây dựng đối tượng đơn hàng mới với thông tin đầy đủ của user và product
        const newOrder = {
          ...form,
          id: String(getNextId()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: user || { name: "Unknown User" },
          product: product || {
            name: "Unknown Product",
            price: 0,
            quantity: 0,
            description: "",
          },
        };

        await axios.post("http://localhost:3000/orders", newOrder);
        fetchData();
        closeModal();
        notyf.success("Order added successfully.");
      } catch (error) {
        notyf.error("Failed to add order.");
      }
    };

    const updateOrder = async () => {
      if (!validateForm()) return;

      try {
        const user = users.value.find((u) => u.id === form.user_id);
        const product = products.value.find((p) => p.id === form.product_id);

        // Xây dựng đối tượng đơn hàng mới với thông tin đầy đủ của user và product
        const updatedOrder = {
          ...form,
          updated_at: new Date().toISOString(),
          user: user || { name: "Unknown User" },
          product: product || {
            name: "Unknown Product",
            price: 0,
            quantity: 0,
            description: "",
          },
        };

        await axios.put(
          `http://localhost:3000/orders/${editId.value}`,
          updatedOrder
        );
        fetchData();
        closeModal();
        notyf.success("Order updated successfully.");
      } catch (error) {
        notyf.error("Failed to update order.");
      }
    };

    const validateForm = () => {
      let isValid = true;

      if (!form.user_id) {
        notyf.error("Customer is required.");
        return (isValid = false);
      }

      if (!form.product_id) {
        notyf.error("Product is required.");
        return (isValid = false);
      }

      if (!form.total || form.total <= 0) {
        notyf.error("Total must be a positive number.");
        return (isValid = false);
      }

      if (!form.quantity || form.quantity <= 0) {
        notyf.error("Quantity must be a positive number.");
        return (isValid = false);
      }

      return isValid;
    };

    const handleSubmit = () => {
      if (isEditing.value) {
        updateOrder();
      } else {
        addOrder();
      }
    };

    const resetForm = () => {
      form.user_id = null;
      form.product_id = null;
      form.status = "pending";
      form.total = 0;
      form.quantity = 0;
      form.payment_method = "online";
    };

    const getNextId = () => {
      return (
        Math.max(...orders.value.map((order) => parseInt(order.id)), 0) + 1
      );
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const formatPrice = (price) => {
      if (typeof price !== "number") {
        price = Number(price);
      }
      return price
        .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        .replace("₫", " VND");
    };
    const formatDate = (date) => new Date(date).toLocaleString();
    const getStatusClass = (status) => {
      return status === "completed"
        ? "badge-success"
        : status === "canceled"
        ? "badge-danger"
        : "badge-warning";
    };
    onMounted(fetchData);

    return {
      orders,
      users,
      products,
      showModal,
      form,
      isEditing,
      openAddModal,
      editOrder,
      deleteOrder,
      handleSubmit,
      closeModal,
      formatPrice,
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

.ellipsis {
  white-space: nowrap; /* Không xuống dòng */
  overflow: hidden; /* Cắt nội dung nếu quá dài */
  text-overflow: ellipsis; /* Thêm dấu "..." */
  max-width: 180px; /* Chiều rộng tối đa, điều chỉnh theo ý bạn */
  display: block; /* Đảm bảo hiệu ứng áp dụng cho phần tử khối */
}

</style>
