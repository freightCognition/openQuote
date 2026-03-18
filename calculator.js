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

// Track which carrier field was last edited: 'flat' (default) or 'rpm'
let lastCarrierEdit = 'flat';

// Track which GP field was last edited: 'percentage' (default) or 'total'
let lastGPEdit = 'percentage';

// Default values for reset
const defaultValues = {
  miles: 1786,
  carrierFlatRate: 2679,
  profitPercentage: 13.5,
  fuelRate: 0.26,
  stops: 0,
  loadFee: 50,
  otherFee: 0
};

// Calculate all values
function calculateAll() {
  const miles = parseFloat(milesInput.value) || 0;
  let carrierFlatRate = parseFloat(carrierFlatRateInput.value) || 0;
  let profitPercentage = parseFloat(profitPercentageInput.value) || 0;
  const fuelRate = parseFloat(fuelRateInput.value) || 0;
  const stops = parseInt(stopsInput.value) || 0;
  const loadFee = parseFloat(loadFeeInput.value) || 0;
  const otherFee = parseFloat(otherFeeInput.value) || 0;

  // Sync carrier RPM ↔ flat rate based on which was last edited
  let carrierRate;
  if (lastCarrierEdit === 'rpm') {
    carrierRate = parseFloat(carrierRateInput.value) || 0;
    carrierFlatRate = carrierRate * miles;
    carrierFlatRateInput.value = carrierFlatRate.toFixed(2);
  } else {
    carrierRate = miles > 0 ? carrierFlatRate / miles : 0;
    carrierRateInput.value = carrierRate.toFixed(2);
  }
  
  // Bidirectional GP sync: derive % from total or total from %
  let allInRate, allInTotal, profitTotal;
  const gpWarningRow = document.getElementById('gp-warning-row');

  if (lastGPEdit === 'total') {
    // User edited profit-total → reverse-calculate GP%
    profitTotal = parseFloat(profitTotalInput.value) || 0;
    allInTotal = profitTotal + carrierFlatRate;
    allInRate = miles > 0 ? allInTotal / miles : 0;
    profitPercentage = (carrierRate > 0 && allInRate > 0)
      ? (1 - carrierRate / allInRate) * 100
      : 0;
    profitPercentageInput.value = profitPercentage.toFixed(2);
  } else {
    // User edited profit-percentage → forward-calculate (existing behavior)
    if (profitPercentage >= 100) {
      if (gpWarningRow) gpWarningRow.style.display = '';
      allInRateInput.value = '';
      profitTotalInput.value = '';
      if (allInTotalInput) allInTotalInput.value = '';
      avgTripTotalInput.value = '';
      linehaulRateInput.value = '';
      linehaulTotalInput.value = '';
      perMileTotalInput.value = '';
      invoiceTotalInput.value = '';
      return;
    }
    const marginMultiplier = 1 / (1 - profitPercentage / 100);
    allInRate = carrierRate * marginMultiplier;
    allInTotal = miles * allInRate;
    profitTotal = Math.max(0, allInTotal - carrierFlatRate);
    profitTotalInput.value = profitTotal.toFixed(2);
  }

  if (gpWarningRow) gpWarningRow.style.display = 'none';
  allInRateInput.value = allInRate.toFixed(2);

  // Calculate All-In Total (miles * all-in rate)
  if (allInTotalInput) {
    allInTotalInput.value = allInTotal.toFixed(2);
  } else {
    avgTripTotalInput.value = allInTotal.toFixed(2);
  }
  
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
  if (!allInTotalInput) {
    avgTripTotalInput.value = avgTripTotal.toFixed(2);
  }

  // Calculate stops total with stop fee from settings
  const stopFee = window.settings ? settings.stopFee : 50.00;
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
    fuelRateInput,
    stopsInput, loadFeeInput, otherFeeInput
  ];

  inputs.forEach(input => {
    input.addEventListener('input', calculateAll);
  });

  // GP-related inputs set lastGPEdit before calculating
  profitPercentageInput.addEventListener('input', () => {
    lastGPEdit = 'percentage';
    calculateAll();
  });
  profitTotalInput.addEventListener('input', () => {
    lastGPEdit = 'total';
    calculateAll();
  });

  // Carrier-related inputs set lastCarrierEdit before calculating
  carrierRateInput.addEventListener('input', () => {
    lastCarrierEdit = 'rpm';
    calculateAll();
  });
  carrierFlatRateInput.addEventListener('input', () => {
    lastCarrierEdit = 'flat';
    calculateAll();
  });
  milesInput.addEventListener('input', () => {
    lastCarrierEdit = 'flat';
    calculateAll();
  });

  resetBtn.addEventListener('click', resetForm);
  
  // Settings button is now handled in settings.js
}

// Reset form to default values
function resetForm() {
  // Reset most values to zero
  milesInput.value = 0;
  carrierFlatRateInput.value = 0;
  profitPercentageInput.value = 0;
  stopsInput.value = 0;
  loadFeeInput.value = 0;
  otherFeeInput.value = 0;
  
  // Only keep values from settings
  if (window.settings) {
    // Preserve fuel rate from settings
    fuelRateInput.value = settings.defaultFuelRate;
  } else {
    // Reset fuel rate to zero if no settings
    fuelRateInput.value = 0;
  }

  // Reset tracking state
  lastGPEdit = 'percentage';

  // Recalculate all values with the updated inputs
  calculateAll();
}

// Initialize calculator
function init() {
  addEventListeners();
  calculateAll();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);