function assert(condition, name, detail) {
  const el = document.getElementById('results');
  if (condition) {
    el.textContent += `✓ ${name}\n`;
  } else {
    el.textContent += `✗ ${name} — ${detail}\n`;
    window._testsFailed = (window._testsFailed || 0) + 1;
  }
}

function setInputs(values) {
  Object.entries(values).forEach(([id, val]) => {
    document.getElementById(id).value = val;
  });
  calculateAll();
}

function getOutput(id) {
  return parseFloat(document.getElementById(id).value);
}

// Test 1: Basic margin math — 17.5% GP on $1942 cost, 1000 miles
setInputs({ miles: 1000, 'carrier-flat-rate': 1942, 'profit-percentage': 17.5, 'fuel-rate': 0 });
assert(
  Math.abs(getOutput('all-in-total') - 2353.94) < 0.01,
  'Margin: 17.5% GP on $1942 = $2353.94 sell',
  `got ${getOutput('all-in-total')} (expected ~2353.94 if using avg-trip-total, check all-in-total)`
);
assert(
  Math.abs(getOutput('profit-total') - 411.94) < 0.01,
  'Margin: profit = $411.94',
  `got ${getOutput('profit-total')}`
);

// Test 2: 0% GP should equal cost
setInputs({ miles: 500, 'carrier-flat-rate': 1000, 'profit-percentage': 0, 'fuel-rate': 0 });
assert(
  Math.abs(getOutput('all-in-rate') - 2.00) < 0.01,
  '0% GP: allInRate = carrierRate',
  `got ${getOutput('all-in-rate')}`
);

// Test 3: GP >= 100% should clear outputs and show warning
setInputs({ miles: 100, 'carrier-flat-rate': 500, 'profit-percentage': 100, 'fuel-rate': 0 });
assert(
  document.getElementById('all-in-rate').value === '',
  'GP=100%: allInRate is cleared (empty)',
  `got "${document.getElementById('all-in-rate').value}"`
);
assert(
  document.getElementById('invoice-total').value === '',
  'GP=100%: invoiceTotal is cleared (empty)',
  `got "${document.getElementById('invoice-total').value}"`
);
assert(
  document.getElementById('gp-warning-row').style.display !== 'none',
  'GP=100%: warning row is visible',
  `display is "${document.getElementById('gp-warning-row').style.display}"`
);

setInputs({ miles: 100, 'carrier-flat-rate': 500, 'profit-percentage': 150, 'fuel-rate': 0 });
assert(
  document.getElementById('all-in-rate').value === '',
  'GP=150%: allInRate is cleared (empty)',
  `got "${document.getElementById('all-in-rate').value}"`
);
assert(
  document.getElementById('gp-warning-row').style.display !== 'none',
  'GP=150%: warning row is visible',
  `display is "${document.getElementById('gp-warning-row').style.display}"`
);

// Test 3c: Warning hides when GP% returns to valid value
setInputs({ miles: 100, 'carrier-flat-rate': 500, 'profit-percentage': 20, 'fuel-rate': 0 });
assert(
  document.getElementById('gp-warning-row').style.display === 'none',
  'GP=20%: warning row is hidden after valid input',
  `display is "${document.getElementById('gp-warning-row').style.display}"`
);
assert(
  document.getElementById('all-in-rate').value !== '',
  'GP=20%: allInRate is populated after valid input',
  `got "${document.getElementById('all-in-rate').value}"`
);

// Test 3b: Negative GP% (selling below cost) should produce sell < cost
setInputs({ miles: 1000, 'carrier-flat-rate': 2000, 'profit-percentage': -10, 'fuel-rate': 0 });
const expectedNegRate = (2000 / 1000) / (1 - (-0.10)); // 2.00 / 1.10 = 1.818...
assert(
  Math.abs(getOutput('all-in-rate') - expectedNegRate) < 0.01,
  'Negative GP: sell rate below carrier rate',
  `got ${getOutput('all-in-rate')}, expected ${expectedNegRate.toFixed(4)}`
);
assert(
  getOutput('profit-total') === 0,
  'Negative GP: profitTotal clamped to 0',
  `got ${getOutput('profit-total')}`
);

// Test 4: Fuel carved out correctly
setInputs({ miles: 1000, 'carrier-flat-rate': 2000, 'profit-percentage': 20, 'fuel-rate': 0.50 });
const expectedSellRate = (2000 / 1000) / (1 - 0.20); // 2.00 / 0.80 = 2.50
assert(
  Math.abs(getOutput('all-in-rate') - expectedSellRate) < 0.01,
  'allInRate with fuel: margin on carrier, fuel separate',
  `got ${getOutput('all-in-rate')}, expected ${expectedSellRate}`
);
assert(
  Math.abs(getOutput('linehaul-rate') - (expectedSellRate - 0.50)) < 0.01,
  'linehaulRate = allInRate - fuelRate',
  `got ${getOutput('linehaul-rate')}`
);

// Test 5: Invoice total = avgTrip + accessorials
setInputs({
  miles: 1000, 'carrier-flat-rate': 2000, 'profit-percentage': 10,
  'fuel-rate': 0.25, stops: 2, 'load-fee': 50, 'other-fee': 25
});
const sellTotal5 = 1000 * ((2000/1000) / (1 - 0.10));
const fuelTotal5 = 1000 * 0.25;
const linehaulTotal5 = sellTotal5 - fuelTotal5;
const accessorial5 = 50 + 25 + (2 * 50);
const expectedInvoice = linehaulTotal5 + fuelTotal5 + accessorial5;
assert(
  Math.abs(getOutput('invoice-total') - expectedInvoice) < 1,
  'invoiceTotal = avgTrip + accessorials',
  `got ${getOutput('invoice-total')}, expected ~${expectedInvoice.toFixed(2)}`
);

// Test 6: Editing carrier RPM should update flat rate
setInputs({ miles: 1000, 'carrier-flat-rate': 0, 'profit-percentage': 0, 'fuel-rate': 0 });
lastCarrierEdit = 'rpm';
document.getElementById('carrier-rate').value = 2.50;
calculateAll();
assert(
  Math.abs(getOutput('carrier-flat-rate') - 2500) < 0.01,
  'RPM edit: $2.50/mi × 1000mi = $2500 flat',
  `got ${getOutput('carrier-flat-rate')}`
);
assert(
  Math.abs(getOutput('all-in-rate') - 2.50) < 0.01,
  'RPM edit: allInRate = carrierRate at 0% GP',
  `got ${getOutput('all-in-rate')}`
);
lastCarrierEdit = 'flat'; // reset for subsequent tests

// Test 7: Edit profit-total → GP% reverse-calculates correctly
// $2679 carrier flat, 1786 miles → carrierRate = 1.50. Set profit-total = 362 → allInTotal = 3041, allInRate = 1.7029
// GP% = (1 - 1.50 / 1.7029) * 100 ≈ 11.91%
setInputs({ miles: 1786, 'carrier-flat-rate': 2679, 'profit-percentage': 0, 'fuel-rate': 0 });
lastGPEdit = 'total';
document.getElementById('profit-total').value = 362;
calculateAll();
const expectedGP7 = (1 - (2679 / 1786) / ((362 + 2679) / 1786)) * 100;
assert(
  Math.abs(getOutput('profit-percentage') - expectedGP7) < 0.1,
  'Reverse GP: $362 profit → GP% ≈ 11.91%',
  `got ${getOutput('profit-percentage')}, expected ~${expectedGP7.toFixed(2)}`
);
lastGPEdit = 'percentage'; // reset

// Test 8: Round-trip — set GP% → read profit → set profit → GP% unchanged
setInputs({ miles: 1000, 'carrier-flat-rate': 2000, 'profit-percentage': 20, 'fuel-rate': 0 });
const profitFromGP = getOutput('profit-total'); // should be 500
lastGPEdit = 'total';
document.getElementById('profit-total').value = profitFromGP;
calculateAll();
assert(
  Math.abs(getOutput('profit-percentage') - 20) < 0.1,
  'Round-trip: GP% → profit → GP% = 20%',
  `got ${getOutput('profit-percentage')}`
);
lastGPEdit = 'percentage'; // reset

// Test 9: Edge case — miles=0 with profit-total edit (no crash)
setInputs({ miles: 0, 'carrier-flat-rate': 0, 'profit-percentage': 0, 'fuel-rate': 0 });
lastGPEdit = 'total';
document.getElementById('profit-total').value = 100;
calculateAll();
assert(
  getOutput('profit-percentage') === 0,
  'Edge: miles=0 profit-total edit → GP% = 0 (no crash)',
  `got ${getOutput('profit-percentage')}`
);
lastGPEdit = 'percentage'; // reset

// Test 10: Edge case — carrierRate=0 with profit-total edit
setInputs({ miles: 1000, 'carrier-flat-rate': 0, 'profit-percentage': 0, 'fuel-rate': 0 });
lastGPEdit = 'total';
document.getElementById('profit-total').value = 500;
calculateAll();
assert(
  getOutput('profit-percentage') === 0,
  'Edge: carrierRate=0 profit-total edit → GP% = 0',
  `got ${getOutput('profit-percentage')}`
);
lastGPEdit = 'percentage'; // reset

// Test 11: Edge case — profit-total=0 → GP%=0
setInputs({ miles: 1000, 'carrier-flat-rate': 2000, 'profit-percentage': 0, 'fuel-rate': 0 });
lastGPEdit = 'total';
document.getElementById('profit-total').value = 0;
calculateAll();
assert(
  Math.abs(getOutput('profit-percentage') - 0) < 0.01,
  'Edge: profit-total=0 → GP% = 0',
  `got ${getOutput('profit-percentage')}`
);
lastGPEdit = 'percentage'; // reset

// Summary
document.getElementById('results').textContent += `\nDone. ${window._testsFailed || 0} failures.\n`;
