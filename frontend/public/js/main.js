// DOM Elements
const header = document.getElementById('header');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');

// Current view state
let currentView = 'dashboard';

// Initialize the app
function initApp() {
  renderHeader();
  renderSidebar();
  renderMainContent();
}

// Render Header
function renderHeader() {
  header.innerHTML = `
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Expiry Alert System</h1>
        <div class="flex items-center space-x-4">
          <span id="notification-bell" class="relative cursor-pointer">
            <i class="fas fa-bell text-xl"></i>
            <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </span>
          <span class="text-sm">Welcome, Admin</span>
        </div>
      </div>
    </header>
  `;
}

// Render Sidebar
function renderSidebar() {
  sidebar.innerHTML = `
    <aside class="w-64 bg-white shadow-md">
      <nav class="p-4">
        <ul class="space-y-2">
          <li>
            <button onclick="changeView('dashboard')" class="w-full text-left p-2 rounded hover:bg-blue-50 ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-600' : ''}">
              <i class="fas fa-tachometer-alt mr-2"></i> Dashboard
            </button>
          </li>
          <li>
            <button onclick="changeView('add-product')" class="w-full text-left p-2 rounded hover:bg-blue-50 ${currentView === 'add-product' ? 'bg-blue-100 text-blue-600' : ''}">
              <i class="fas fa-plus-circle mr-2"></i> Add Product
            </button>
          </li>
          <li>
            <button onclick="changeView('scan-products')" class="w-full text-left p-2 rounded hover:bg-blue-50 ${currentView === 'scan-products' ? 'bg-blue-100 text-blue-600' : ''}">
              <i class="fas fa-search mr-2"></i> Scan Products
            </button>
          </li>
          <li>
            <button onclick="changeView('export-products')" class="w-full text-left p-2 rounded hover:bg-blue-50 ${currentView === 'export-products' ? 'bg-blue-100 text-blue-600' : ''}">
              <i class="fas fa-file-export mr-2"></i> Export Products
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  `;
}

// Change view function
window.changeView = function(view) {
  currentView = view;
  renderSidebar();
  renderMainContent();
}

// Render Main Content based on current view
function renderMainContent() {
  switch(currentView) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'add-product':
      renderAddProduct();
      break;
    case 'scan-products':
      renderScanProducts();
      break;
    case 'export-products':
      renderExportProducts();
      break;
    default:
      renderDashboard();
  }
}

// Dashboard View
function renderDashboard() {
  mainContent.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-6">Dashboard Overview</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Summary Cards -->
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 class="text-gray-600 font-medium">Total Products</h3>
          <p class="text-3xl font-bold text-blue-600">0</p>
        </div>
        
        <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 class="text-gray-600 font-medium">Expiring Soon</h3>
          <p class="text-3xl font-bold text-yellow-600">0</p>
        </div>
        
        <div class="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 class="text-gray-600 font-medium">Expired</h3>
          <p class="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>
      
      <!-- Recent Expiring Products -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Recent Expiring Products</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr class="bg-gray-100">
                <th class="py-2 px-4 text-left">Product Name</th>
                <th class="py-2 px-4 text-left">Category</th>
                <th class="py-2 px-4 text-left">Expiry Date</th>
                <th class="py-2 px-4 text-left">Days Left</th>
              </tr>
            </thead>
            <tbody id="expiring-products">
              <!-- Will be populated by JavaScript -->
              <tr>
                <td colspan="4" class="py-4 text-center text-gray-500">No expiring products found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// Add Product View
function renderAddProduct() {
  mainContent.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-6">Add New Product</h2>
      
      <form id="add-product-form" class="space-y-4">
        <div>
          <label for="product-name" class="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" id="product-name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        
        <div>
          <label for="product-category" class="block text-sm font-medium text-gray-700">Category</label>
          <select id="product-category" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="">Select a category</option>
            <option value="medicine">Medicine</option>
            <option value="food">Food</option>
            <option value="cosmetics">Cosmetics</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label for="expiry-date" class="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input type="date" id="expiry-date" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        
        <div>
          <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" id="quantity" min="1" value="1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        
        <div>
          <label for="batch-number" class="block text-sm font-medium text-gray-700">Batch Number (Optional)</label>
          <input type="text" id="batch-number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
        </div>
        
        <div class="pt-2">
          <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Add Product
          </button>
        </div>
      </form>
    </div>
  `;

  // Add form submission handler
  document.getElementById('add-product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Here you would normally send data to your backend
    alert('Product added successfully!');
    this.reset();
  });
}

// Scan Products View
function renderScanProducts() {
  mainContent.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-6">Scan Products</h2>
      
      <div class="mb-6">
        <div class="flex items-center space-x-4">
          <select id="scan-filter" class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="all">All Products</option>
            <option value="expiring">Expiring Soon (≤ 30 days)</option>
            <option value="expired">Expired</option>
          </select>
          <button onclick="scanProducts()" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Scan
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 text-left">Product Name</th>
              <th class="py-2 px-4 text-left">Category</th>
              <th class="py-2 px-4 text-left">Expiry Date</th>
              <th class="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody id="scan-results">
            <tr>
              <td colspan="4" class="py-4 text-center text-gray-500">Scan results will appear here</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Export Products View
function renderExportProducts() {
  mainContent.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-6">Export Products</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Export Format</label>
          <div class="mt-1 space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" name="export-format" value="csv" checked class="h-4 w-4 text-blue-600 focus:ring-blue-500">
              <span class="ml-2">CSV</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="export-format" value="excel" class="h-4 w-4 text-blue-600 focus:ring-blue-500">
              <span class="ml-2">Excel</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" name="export-format" value="pdf" class="h-4 w-4 text-blue-600 focus:ring-blue-500">
              <span class="ml-2">PDF</span>
            </label>
          </div>
        </div>
        
        <div>
          <label for="export-filter" class="block text-sm font-medium text-gray-700">Filter</label>
          <select id="export-filter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="all">All Products</option>
            <option value="expiring">Expiring Soon (≤ 30 days)</option>
            <option value="expired">Expired</option>
            <option value="category">By Category</option>
          </select>
        </div>
        
        <div class="pt-2">
          <button onclick="exportProducts()" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Export Products
          </button>
        </div>
      </div>
    </div>
  `;
}

// Scan products function
window.scanProducts = function() {
  const filter = document.getElementById('scan-filter').value;
  // Here you would normally fetch data from your backend based on the filter
  const results = document.getElementById('scan-results');
  
  // Simulate loading
  results.innerHTML = `
    <tr>
      <td colspan="4" class="py-4 text-center text-gray-500">
        <i class="fas fa-spinner fa-spin mr-2"></i> Scanning products...
      </td>
    </tr>
  `;
  
  // Simulate API call with timeout
  setTimeout(() => {
    // This is mock data - replace with actual API call
    if (filter === 'all') {
      results.innerHTML = `
        <tr>
          <td class="py-2 px-4">Paracetamol</td>
          <td class="py-2 px-4">Medicine</td>
          <td class="py-2 px-4">2023-12-15</td>
          <td class="py-2 px-4"><span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Expiring soon</span></td>
        </tr>
        <tr>
          <td class="py-2 px-4">Vitamin C</td>
          <td class="py-2 px-4">Medicine</td>
          <td class="py-2 px-4">2024-05-20</td>
          <td class="py-2 px-4"><span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Good</span></td>
        </tr>
      `;
    } else if (filter === 'expiring') {
      results.innerHTML = `
        <tr>
          <td class="py-2 px-4">Paracetamol</td>
          <td class="py-2 px-4">Medicine</td>
          <td class="py-2 px-4">2023-12-15</td>
          <td class="py-2 px-4"><span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Expiring soon</span></td>
        </tr>
      `;
    } else {
      results.innerHTML = `
        <tr>
          <td colspan="4" class="py-4 text-center text-gray-500">No products match your filter criteria</td>
        </tr>
      `;
    }
  }, 1000);
}

// Export products function
window.exportProducts = function() {
  const format = document.querySelector('input[name="export-format"]:checked').value;
  const filter = document.getElementById('export-filter').value;
  
  alert(`Exporting products as ${format.toUpperCase()} with filter: ${filter}`);
  // Here you would normally call your backend API to generate the export file
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);