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

// Test 3: GP >= 100% should not produce Infinity or negative
setInputs({ miles: 100, 'carrier-flat-rate': 500, 'profit-percentage': 100, 'fuel-rate': 0 });
assert(
  isFinite(getOutput('all-in-rate')) && getOutput('all-in-rate') >= 0,
  'GP=100%: allInRate no Infinity, non-negative',
  `got ${getOutput('all-in-rate')}`
);
assert(
  getOutput('profit-total') >= 0,
  'GP=100%: profitTotal non-negative (clamped)',
  `got ${getOutput('profit-total')}`
);

setInputs({ miles: 100, 'carrier-flat-rate': 500, 'profit-percentage': 150, 'fuel-rate': 0 });
assert(
  isFinite(getOutput('all-in-rate')) && getOutput('all-in-rate') >= 0,
  'GP=150%: allInRate no Infinity, non-negative',
  `got ${getOutput('all-in-rate')}`
);
assert(
  getOutput('profit-total') >= 0,
  'GP=150%: profitTotal non-negative (clamped)',
  `got ${getOutput('profit-total')}`
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

// Summary
document.getElementById('results').textContent += `\nDone. ${window._testsFailed || 0} failures.\n`;
