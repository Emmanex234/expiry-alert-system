const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? "https://expiry-alert-system.onrender.com" 
    : "http://localhost:3000" // For local development
};