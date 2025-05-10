// DOM elements
const milesInput = document.getElementById('miles');
const carrierFlatRateInput = document.getElementById('carrier-flat-rate');
const carrierRateInput = document.getElementById('carrier-rate');
const profitPercentageInput = document.getElementById('profit-percentage');
const profitTotalInput = document.getElementById('profit-total');
const allInRateInput = document.getElementById('all-in-rate');
const allInTotalInput = document.getElementById('all-in-total');
const fuelRateInput = document.getElementById('fuel-rate');
const fuelTotalInput = document.getElementById('fuel-total');
const linehaulRateInput = document.getElementById('linehaul-rate');
const linehaulTotalInput = document.getElementById('linehaul-total');
const avgTripTotalInput = document.getElementById('avg-trip-total');
const stopsInput = document.getElementById('stops');
const stopsTotalInput = document.getElementById('stops-total');
const loadFeeInput = document.getElementById('load-fee');
const otherFeeInput = document.getElementById('other-fee');
const accessorialTotalInput = document.getElementById('accessorial-total');
const perMileTotalInput = document.getElementById('per-mile-total');
const invoiceTotalInput = document.getElementById('invoice-total');
const resetBtn = document.getElementById('reset-btn');

// Default values for reset
const defaultValues = {
  miles: 1786,
  carrierFlatRate: 2679.00,
  profitPercentage: window.settings ? settings.defaultProfitMargin : 13.5,
  fuelRate: window.settings ? settings.defaultFuelRate : 0.26,
  stops: 0,
  loadFee: window.settings ? settings.defaultLoadFee : 50.00,
  otherFee: 0.00
};

// Calculate all values
function calculateAll() {
  const miles = parseFloat(milesInput.value) || 0;
  const carrierFlatRate = parseFloat(carrierFlatRateInput.value) || 0;
  const profitPercentage = parseFloat(profitPercentageInput.value) || 0;
  const fuelRate = parseFloat(fuelRateInput.value) || 0;
  const stops = parseInt(stopsInput.value) || 0;
  const loadFee = parseFloat(loadFeeInput.value) || 0;
  const otherFee = parseFloat(otherFeeInput.value) || 0;

  // Calculate Carrier Rate per mile (flat rate ÷ miles)
  const carrierRate = miles > 0 ? carrierFlatRate / miles : 0;
  carrierRateInput.value = carrierRate.toFixed(2);
  
  // Calculate Gross Profit Total (carrier flat rate * profit percentage / 100)
  const profitTotal = carrierFlatRate * (profitPercentage / 100);
  profitTotalInput.value = profitTotal.toFixed(2);
  
  // Calculate All-In Rate (carrier rate * gross profit percentage)
  const grossProfitMultiplier = 1 + (profitPercentage / 100);
  const allInRate = carrierRate * grossProfitMultiplier;
  allInRateInput.value = allInRate.toFixed(2);
  
  // Calculate All-In Total (miles * all-in rate)
  const allInTotal = miles * allInRate;
  allInTotalInput.value = allInTotal.toFixed(2);
  
  // Calculate Fuel Surcharge total (miles * fuel rate)
  const fuelTotal = miles * fuelRate;
  fuelTotalInput.value = fuelTotal.toFixed(2);
  
  // Calculate Linehaul Rate (All-In Rate - Fuel Surcharge per mile)
  const fuelSurchargePerMile = miles > 0 ? fuelTotal / miles : 0;
  const linehaulRate = Math.max(0, allInRate - fuelSurchargePerMile);
  linehaulRateInput.value = linehaulRate.toFixed(2);
  
  // Calculate Linehaul Total (miles * linehaul rate)
  const linehaulTotal = miles * linehaulRate;
  linehaulTotalInput.value = linehaulTotal.toFixed(2);

  // Calculate average trip total (linehaul total + fuel total)
  const avgTripTotal = linehaulTotal + fuelTotal;
  avgTripTotalInput.value = avgTripTotal.toFixed(2);

  // Calculate stops total with stop fee from settings if available
  const stopFee = window.settings ? settings.stopFee : 0;
  const stopsTotal = stops * stopFee;
  stopsTotalInput.value = stopsTotal.toFixed(2);

  // Calculate accessorial total
  const accessorialTotal = loadFee + otherFee + stopsTotal;
  accessorialTotalInput.value = accessorialTotal.toFixed(2);

  // Calculate invoice total
  const invoiceTotal = avgTripTotal + accessorialTotal;
  invoiceTotalInput.value = invoiceTotal.toFixed(2);

  // Calculate per mile total
  const perMileTotal = (miles > 0) ? invoiceTotal / miles : 0;
  perMileTotalInput.value = perMileTotal.toFixed(2);
}

// Add event listeners to all inputs
function addEventListeners() {
  const inputs = [
    milesInput, carrierFlatRateInput, profitPercentageInput, fuelRateInput, 
    stopsInput, loadFeeInput, otherFeeInput
  ];

  inputs.forEach(input => {
    input.addEventListener('input', calculateAll);
  });

  resetBtn.addEventListener('click', resetForm);
  
  // Add gear icon event listener for settings
  const gearIcon = document.querySelector('.gear-icon');
  if (gearIcon) {
    gearIcon.addEventListener('click', () => {
      alert('Settings functionality will be implemented in a future update.');
    });
  }
}

// Reset form to default values
function resetForm() {
  milesInput.value = defaultValues.miles;
  carrierFlatRateInput.value = defaultValues.carrierFlatRate;
  profitPercentageInput.value = defaultValues.profitPercentage;
  fuelRateInput.value = defaultValues.fuelRate;
  stopsInput.value = defaultValues.stops;
  loadFeeInput.value = defaultValues.loadFee;
  otherFeeInput.value = defaultValues.otherFee;

  calculateAll();
}

// Initialize calculator
function init() {
  addEventListeners();
  calculateAll();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);