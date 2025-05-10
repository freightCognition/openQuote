// Default settings for the calculator
const settings = {
  // Stop fee in dollars
  stopFee: 50.00,
  
  // Default profit margin percentage
  defaultProfitMargin: 13.5,
  
  // Default fuel surcharge per mile
  defaultFuelRate: 0.26,
  
  // Default load fee
  defaultLoadFee: 50.00,
  
  // Price formatting
  currency: '$',
  decimalPlaces: 2
};

// Function to save settings to localStorage
function saveSettings() {
  localStorage.setItem('rateCalculatorSettings', JSON.stringify(settings));
}

// Function to load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem('rateCalculatorSettings');
  if (savedSettings) {
    Object.assign(settings, JSON.parse(savedSettings));
  }
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
}); 