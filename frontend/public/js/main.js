// API Configuration - Uses relative path for same-domain deployment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : ''; // Empty when frontend is served by backend

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
  setupEventListeners();
}

// ======================
// RENDERING FUNCTIONS
// ======================

function renderHeader() {
  header.innerHTML = `
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Expiry Alert System</h1>
        <div class="flex items-center space-x-4">
          <span id="notification-bell" class="relative cursor-pointer">
            <i class="fas fa-bell text-xl"></i>
            <span id="notification-count" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
          </span>
          <span class="text-sm">Welcome, Admin</span>
        </div>
      </div>
    </header>
  `;
}

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

window.changeView = function(view) {
  currentView = view;
  renderSidebar();
  renderMainContent();
}

function renderMainContent() {
  switch(currentView) {
    case 'dashboard': renderDashboard(); break;
    case 'add-product': renderAddProduct(); break;
    case 'scan-products': renderScanProducts(); break;
    case 'export-products': renderExportProducts(); break;
    default: renderDashboard();
  }
}

// ======================
// API INTEGRATION
// ======================

async function renderDashboard() {
  try {
    const [stats, expiringProducts] = await Promise.all([
      apiFetch('/api/products/stats'),
      apiFetch('/api/products/expiring?limit=5')
    ]);

    mainContent.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-6">Dashboard Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 class="text-gray-600 font-medium">Total Products</h3>
            <p class="text-3xl font-bold text-blue-600">${stats.totalProducts || 0}</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 class="text-gray-600 font-medium">Expiring Soon</h3>
            <p class="text-3xl font-bold text-yellow-600">${stats.expiringSoon || 0}</p>
          </div>
          <div class="bg-red-50 p-4 rounded-lg border border-red-100">
            <h3 class="text-gray-600 font-medium">Expired</h3>
            <p class="text-3xl font-bold text-red-600">${stats.expired || 0}</p>
          </div>
        </div>
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
                ${expiringProducts.length ? 
                  expiringProducts.map(p => `
                    <tr>
                      <td class="py-2 px-4">${p.name}</td>
                      <td class="py-2 px-4">${p.category}</td>
                      <td class="py-2 px-4">${new Date(p.expiryDate).toLocaleDateString()}</td>
                      <td class="py-2 px-4">
                        <span class="${p.daysUntilExpiry <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} px-2 py-1 rounded-full text-xs">
                          ${p.daysUntilExpiry} days
                        </span>
                      </td>
                    </tr>
                  `).join('') : 
                  '<tr><td colspan="4" class="py-4 text-center text-gray-500">No expiring products</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showError("Failed to load dashboard", error);
  }
}

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
          <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Add Product
          </button>
        </div>
      </form>
    </div>
  `;
}

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
              <td colspan="4" class="py-4 text-center text-gray-500">Select a filter and click "Scan"</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

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
          </div>
        </div>
        <div>
          <label for="export-filter" class="block text-sm font-medium text-gray-700">Filter</label>
          <select id="export-filter" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
            <option value="all">All Products</option>
            <option value="expiring">Expiring Soon (≤ 30 days)</option>
            <option value="expired">Expired</option>
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

// ======================
// EVENT HANDLERS
// ======================

function setupEventListeners() {
  // Add Product Form Submission
  document.addEventListener('submit', async (e) => {
    if (e.target.id === 'add-product-form') {
      e.preventDefault();
      try {
        await apiFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            expiryDate: document.getElementById('expiry-date').value,
            quantity: parseInt(document.getElementById('quantity').value),
            batchNumber: document.getElementById('batch-number').value || undefined
          })
        });
        alert('Product added successfully!');
        e.target.reset();
        changeView('dashboard');
      } catch (error) {
        showError('Failed to add product', error);
      }
    }
  });
}

window.scanProducts = async function() {
  try {
    const filter = document.getElementById('scan-filter').value;
    const results = document.getElementById('scan-results');
    
    results.innerHTML = `
      <tr>
        <td colspan="4" class="py-4 text-center text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Scanning...
        </td>
      </tr>
    `;

    const products = await apiFetch(`/api/products/scan?filter=${filter}`);
    
    results.innerHTML = products.length ? 
      products.map(p => `
        <tr>
          <td class="py-2 px-4">${p.name}</td>
          <td class="py-2 px-4">${p.category}</td>
          <td class="py-2 px-4">${new Date(p.expiryDate).toLocaleDateString()}</td>
          <td class="py-2 px-4">
            <span class="${
              p.status === 'expired' ? 'bg-red-100 text-red-800' :
              p.status === 'expiring_soon' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            } px-2 py-1 rounded-full text-xs">
              ${p.status === 'expired' ? 'Expired' : 
               p.status === 'expiring_soon' ? 'Expiring soon' : 'Good'}
            </span>
          </td>
        </tr>
      `).join('') : 
      '<tr><td colspan="4" class="py-4 text-center text-gray-500">No products found</td></tr>';
  } catch (error) {
    document.getElementById('scan-results').innerHTML = `
      <tr>
        <td colspan="4" class="py-4 text-center text-red-500">
          Error: ${error.message}
        </td>
      </tr>
    `;
  }
}

window.exportProducts = async function() {
  try {
    const format = document.querySelector('input[name="export-format"]:checked').value;
    const filter = document.getElementById('export-filter').value;
    
    const response = await fetch(`${API_BASE_URL}/api/products/export?format=${format}&filter=${filter}`);
    
    if (format === 'csv') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Export completed!');
    }
  } catch (error) {
    showError('Export failed', error);
  }
}

// ======================
// HELPER FUNCTIONS
// ======================

async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Request failed');
    }

    return response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

function showError(context, error) {
  console.error(`${context}:`, error);
  
  // Create error notification
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg';
  notification.innerHTML = `
    <p class="font-medium">${context}</p>
    <p class="text-sm">${error.message}</p>
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initApp);