<template>
  <div>
    <h2>Product Management</h2>
    <!-- Nút mở modal -->
    <button class="btn btn-primary mb-4" @click="openAddModal">
      Add Product
    </button>

    <!-- Bảng sản phẩm -->
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>
            <img
              :src="product.img"
              alt="Product Image"
              style="width: 50px; height: auto"
            />
          </td>
          <td>
            <span class="ellipsis" :title="product.name">
              {{ product.name }}
            </span>
          </td>
          <td>{{ formatPrice(product.price) }}</td>
          <td>{{ product.quantity }}</td>
          <td>
            <span class="ellipsis" :title="product.description">
              {{ product.description }}
            </span>
          </td>
          <td class="text-center">
            <span :class="['status-badge', getStatusClass(product.status)]">{{
              product.status
            }}</span>
          </td>
          <td>
            <button
              @click="editProduct(product)"
              class="btn btn-primary btn-sm"
            >
              Edit
            </button>
            <button
              @click="deleteProduct(product.id)"
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
        <h3>{{ isEditing ? "Edit Product" : "Add Product" }}</h3>
        <form @submit.prevent="handleSubmit">
          <!-- ID Field (Auto-incremented) -->
          <div class="mb-3">
            <label for="product-id" class="form-label">Product ID</label>
            <input
              id="product-id"
              v-model="form.id"
              class="form-control"
              placeholder="ID (Auto)"
              disabled
            />
          </div>

          <!-- Image URL -->
          <div class="mb-3">
            <label for="product-img" class="form-label">Image URL</label>
            <input
              id="product-img"
              v-model="form.img"
              class="form-control"
              placeholder="Enter Image URL"
            />
          </div>

          <!-- Product Name -->
          <div class="mb-3">
            <label for="product-name" class="form-label">Product Name</label>
            <input
              id="product-name"
              v-model="form.name"
              class="form-control"
              placeholder="Enter Product Name"
            />
          </div>

          <!-- Price -->
          <div class="mb-3">
            <label for="product-price" class="form-label">Price</label>
            <div class="input-group">
              <input
                id="product-price"
                v-model.number="form.price"
                type="number"
                class="form-control"
                placeholder="Enter Price"
              />
              <span class="input-group-text">VND</span>
            </div>
          </div>

          <!-- Quantity -->
          <div class="mb-3">
            <label for="product-quantity" class="form-label">Quantity</label>
            <input
              id="product-quantity"
              v-model.number="form.quantity"
              type="number"
              class="form-control"
              placeholder="Enter Quantity"
            />
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label for="product-description" class="form-label"
              >Description</label
            >
            <textarea
              id="product-description"
              v-model="form.description"
              class="form-control"
              placeholder="Enter Description"
            ></textarea>
          </div>

          <!-- Status -->
          <div class="mb-3">
            <label for="product-status" class="form-label">Status</label>
            <div class="select-wrapper">
              <select
                id="product-status"
                v-model="form.status"
                class="form-control"
              >
                <option value="active">Active</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="inactive">Inactive</option>
              </select>
              <span class="dropdown-icon">▼</span>
            </div>
          </div>
          <!-- Buttons -->
          <div class="modal-buttons">
            <button type="submit" class="btn btn-primary">
              {{ isEditing ? "Update Product" : "Add Product" }}
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
const formatPrice = (price) => {
  if (typeof price !== "number") {
    price = Number(price);
  }
  return price
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    .replace("₫", " VND");
};
export default {
  setup() {
    const products = ref([]);
    const showModal = ref(false);
    const isEditing = ref(false);
    const editId = ref(null);

    const form = reactive({
      id: null,
      img: "",
      name: "",
      price: 0,
      quantity: 0,
      description: "",
      status: "active",
    });

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        products.value = response.data.map((product) => ({
          ...product,
          id: String(product.id),
        }));
      } catch (error) {
        notyf.error("Failed to fetch products.");
      }
    };

    const deleteProduct = async (id) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirmed) return;

      try {
        await axios.delete(`http://localhost:3000/products/${id}`);
        fetchProducts();
        notyf.success("Product deleted successfully.");
      } catch (error) {
        notyf.error("Failed to delete product.");
      }
    };

    const openAddModal = () => {
      resetForm();
      isEditing.value = false;
      form.id = getNextId();
      showModal.value = true;
    };

    const editProduct = (product) => {
      Object.assign(form, product);
      isEditing.value = true;
      editId.value = product.id;
      showModal.value = true;
    };

    const addProduct = async () => {
      if (!validateForm()) return;

      try {
        const newProduct = { ...form, id: String(getNextId()) };
        await axios.post("http://localhost:3000/products", newProduct);
        fetchProducts();
        closeModal();
        notyf.success("Product added successfully.");
      } catch (error) {
        notyf.error("Failed to add product.");
      }
    };

    const updateProduct = async () => {
      if (!validateForm()) return;

      try {
        await axios.put(`http://localhost:3000/products/${editId.value}`, form);
        fetchProducts();
        closeModal();
        notyf.success("Product updated successfully.");
      } catch (error) {
        notyf.error("Failed to update product.");
      }
    };

    const validateForm = () => {
      let isValid = true;

      // Kiểm tra trường img
      if (!form.img) {
        notyf.error("Image URL cannot be empty.");
        return (isValid = false);
      }

      // Kiểm tra trường name
      if (!form.name) {
        notyf.error("Product Name cannot be empty.");
        return (isValid = false);
      }

      // Kiểm tra trường price
      if (!form.price || form.price <= 0) {
        notyf.error(
          "Product Price cannot be empty and must be greater than 0."
        );
        return (isValid = false);
      }

      // Kiểm tra trường quantity
      if (!form.quantity || form.quantity <= 0) {
        notyf.error("Quantity cannot be empty and must be greater than 0.");
        return (isValid = false);
      }

      // Kiểm tra trường description
      if (!form.description) {
        notyf.error("Description cannot be empty.");
        return (isValid = false);
      }

      return isValid;
    };

    const getNextId = () => {
      return products.value.length > 0
        ? String(
            Math.max(
              ...products.value.map((product) => parseInt(product.id, 10))
            ) + 1
          )
        : "1";
    };

    const handleSubmit = () => {
      if (isEditing.value) {
        updateProduct();
      } else {
        addProduct();
      }
    };

    const closeModal = () => {
      showModal.value = false;
      resetForm();
    };

    const resetForm = () => {
      form.id = null;
      form.img = "";
      form.name = "";
      form.price = 0;
      form.quantity = 0;
      form.description = "";
      form.status = "active";
    };

    const getStatusClass = (status) => {
      return status === "active"
        ? "badge-success"
        : status === "out_of_stock"
        ? "badge-warning"
        : "badge-danger";
    };

    onMounted(fetchProducts);

    return {
      products,
      showModal,
      isEditing,
      form,
      fetchProducts,
      deleteProduct,
      openAddModal,
      editProduct,
      handleSubmit,
      closeModal,
      getStatusClass,
      formatPrice,
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
  max-width: 200px; /* Chiều rộng tối đa, điều chỉnh theo ý bạn */
  display: block; /* Đảm bảo hiệu ứng áp dụng cho phần tử khối */
}
</style>
