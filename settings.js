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

// Initialize settings modal functionality
function initSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const closeBtn = document.querySelector('.close-modal');
  const saveBtn = document.getElementById('save-settings');
  const cancelBtn = document.getElementById('cancel-settings');
  const stopChargeInput = document.getElementById('default-stop-charge');
  const fuelRateInput = document.getElementById('default-fuel-rate');
  
  // Open modal when settings button is clicked
  settingsBtn.addEventListener('click', () => {
    // Update input values with current settings
    stopChargeInput.value = settings.stopFee.toFixed(settings.decimalPlaces);
    fuelRateInput.value = settings.defaultFuelRate.toFixed(settings.decimalPlaces);
    
    // Show modal
    modal.style.display = 'block';
  });
  
  // Close modal when X is clicked
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Close modal when Cancel is clicked
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // Save settings when Save button is clicked
  saveBtn.addEventListener('click', () => {
    // Update settings object with form values
    settings.stopFee = parseFloat(stopChargeInput.value);
    settings.defaultFuelRate = parseFloat(fuelRateInput.value);
    
    // Save to localStorage
    saveSettings();
    
    // Close modal
    modal.style.display = 'none';
    
    // Update calculator with new settings
    updateCalculator();
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

// Function to update calculator based on new settings
function updateCalculator() {
  // Recalculate stops total if there are any stops
  const stopsInput = document.getElementById('stops');
  const stopsTotalInput = document.getElementById('stops-total');
  const fuelRateInput = document.getElementById('fuel-rate');
  
  // Update and recalculate stops
  if (stopsInput && stopsTotalInput && parseInt(stopsInput.value) > 0) {
    const stopsCount = parseInt(stopsInput.value);
    stopsTotalInput.value = (stopsCount * settings.stopFee).toFixed(settings.decimalPlaces);
  }
  
  // Update fuel rate field
  if (fuelRateInput) {
    fuelRateInput.value = settings.defaultFuelRate.toFixed(settings.decimalPlaces);
  }
  
  // Trigger recalculation of the entire calculator
  const event = new Event('input', { bubbles: true });
  if (stopsInput) stopsInput.dispatchEvent(event);
  if (fuelRateInput) fuelRateInput.dispatchEvent(event);
}

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initSettingsModal();
}); 