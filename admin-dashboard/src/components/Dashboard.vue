<template>
  <div>
    <h2>Dashboard</h2>
    <div class="charts-container">
      <div class="chart">
        <h3>User Status</h3>
        <canvas ref="userStatusChart"></canvas>
      </div>
      <div class="chart">
        <h3>Product Status</h3>
        <canvas ref="productStatusChart"></canvas>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

export default {
  setup() {
    const totalActiveUsers = ref(0);
    const totalInactiveUsers = ref(0);
    const totalActiveProducts = ref(0);
    const totalInactiveProducts = ref(0);
    const totalOutOfStockProducts = ref(0);

    const userStatusChart = ref(null);
    const productStatusChart = ref(null);

    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:3000/users');
        const productsResponse = await axios.get('http://localhost:3000/products');

        // Phân tích dữ liệu người dùng
        const users = usersResponse.data;
        totalActiveUsers.value = users.filter(user => user.status === 'active').length;
        totalInactiveUsers.value = users.filter(user => user.status === 'inactive').length;

        // Phân tích dữ liệu sản phẩm
        const products = productsResponse.data;
        totalActiveProducts.value = products.filter(product => product.status === 'active').length;
        totalInactiveProducts.value = products.filter(product => product.status === 'inactive').length;
        totalOutOfStockProducts.value = products.filter(product => product.status === 'out_of_stock').length;

        // Hiển thị biểu đồ
        renderCharts();
      } catch (error) {
        console.error(error);
      }
    };

    const renderCharts = () => {
      // Biểu đồ User Status
      new Chart(userStatusChart.value, {
        type: 'doughnut',
        data: {
          labels: ['Active', 'Inactive'],
          datasets: [{
            data: [totalActiveUsers.value, totalInactiveUsers.value],
            backgroundColor: ['#4caf50', '#dc3545'], // Xanh lá cho Active, Đỏ cho Inactive
          }],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
          },
          responsive: true,
        },
      });

      // Biểu đồ Product Status
      new Chart(productStatusChart.value, {
        type: 'pie',
        data: {
          labels: ['Active', 'Inactive', 'Out of Stock'],
          datasets: [{
            data: [
              totalActiveProducts.value,
              totalInactiveProducts.value,
              totalOutOfStockProducts.value,
            ],
            backgroundColor: ['#4caf50', '#dc3545', '#ffc107'], // Xanh lá cho Active, Đỏ cho Inactive, Vàng cho Out of Stock
          }],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
            },
          },
          responsive: true,
        },
      });
    };

    onMounted(() => {
      fetchData();
    });

    return {
      userStatusChart,
      productStatusChart,
    };
  },
};
</script>



<style scoped>
.charts-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.chart {
  max-width: 300px;
  text-align: center;
  margin: 20px;
}
</style>

