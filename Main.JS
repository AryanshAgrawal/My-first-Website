const app = document.getElementById('app');

const state = {
  users: JSON.parse(localStorage.getItem('kts_users') || '{}'),
  currentUser: JSON.parse(localStorage.getItem('kts_current') || 'null'),
  orders: JSON.parse(localStorage.getItem('kts_orders') || '[]'),
  pendingOrder: null,
};

const staff = {
  owner: { email: 'owner@ktiffin.com', password: 'Owner@123', role: 'owner' },
  manager: { email: 'manager@ktiffin.com', password: 'Manager@123', role: 'manager' },
  operator: { email: 'operator@ktiffin.com', password: 'Operator@123', role: 'operator' },
};

const bulkFoodItems = [
  { item: 'Veg Biryani', rate: 180 }, { item: 'Paneer Butter Masala', rate: 220 }, { item: 'Dal Tadka', rate: 130 },
  { item: 'Jeera Rice', rate: 110 }, { item: 'Roti (per piece)', rate: 15 }, { item: 'Gulab Jamun', rate: 35 }
];

function save() {
  localStorage.setItem('kts_users', JSON.stringify(state.users));
  localStorage.setItem('kts_current', JSON.stringify(state.currentUser));
  localStorage.setItem('kts_orders', JSON.stringify(state.orders));
}

function renderAboutLogin() {
  app.innerHTML = `
  <section class="card">
    <h2>About Us</h2>
    <p>The K Tiffin Story serves hygienic meals with consistency, affordability, and quality for homes, offices, and events.</p>
    <div class="grid cols-4">
      <div class="stat"><strong>2500+</strong><br><span class="small">Monthly Orders</span></div>
      <div class="stat"><strong>98%</strong><br><span class="small">On-time Delivery</span></div>
      <div class="stat"><strong>4.7/5</strong><br><span class="small">Customer Rating</span></div>
      <div class="stat"><strong>120+</strong><br><span class="small">Corporate Clients</span></div>
    </div>
  </section>
  <section class="card grid cols-2">
    <div>
      <h3>Login</h3>
      <input id="loginEmail" placeholder="Email" />
      <input id="loginPass" type="password" placeholder="Password" />
      <button class="primary" onclick="login()">Login</button>
      <p class="small">Staff Logins: owner@ktiffin.com, manager@ktiffin.com, operator@ktiffin.com</p>
    </div>
    <div>
      <h3>Register</h3>
      <input id="regName" placeholder="Full Name" />
      <input id="regEmail" placeholder="Email" />
      <input id="regPhone" placeholder="Phone" />
      <input id="regPass" type="password" placeholder="Password" />
      <button onclick="registerUser()">Register</button>
    </div>
  </section>`;
}

function login() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value;
  const staffUser = Object.values(staff).find(s => s.email === email && s.password === pass);
  if (staffUser) { state.currentUser = { email, name: staffUser.role.toUpperCase(), role: staffUser.role }; save(); return render(); }
  const user = state.users[email];
  if (!user || user.password !== pass) return alert('Invalid credentials');
  state.currentUser = { ...user, email, role: 'customer' }; save(); render();
}

function registerUser() {
  const name = regName.value.trim(), email = regEmail.value.trim().toLowerCase(), phone = regPhone.value.trim(), password = regPass.value;
  if (!name || !email || !phone || !password) return alert('Please fill all fields.');
  state.users[email] = { name, phone, password }; state.currentUser = { name, phone, email, role: 'customer' }; save(); render();
}

function logout() { state.currentUser = null; save(); render(); }

function renderServiceSelection() {
  app.innerHTML = `<section class="card"><h2>Choose Type of Service</h2><div class="grid cols-2">
    <button onclick="openService('Regular Meal Service')">Regular Meal Service</button>
    <button onclick="openService('Corporate Meal Service')">Corporate Meal Service</button>
    <button onclick="openService('Bulk Ordering Service')">Bulk Ordering Service</button>
    <button onclick="openService('Catering Service')">Catering Service</button>
  </div><br><button onclick="logout()">Logout</button></section>`;
}

function openService(service) {
  state.pendingOrder = { service, user: state.currentUser, status: 'Pending' };
  if (service === 'Regular Meal Service') return renderRegularSubscription();
  if (service === 'Bulk Ordering Service') return renderBulkOrdering();
  if (service === 'Corporate Meal Service') return renderCorporate();
  return renderCatering();
}

function renderRegularSubscription() {
  app.innerHTML = `<section class="card"><h2>Regular Meal Service</h2>
    <p>Choose subscription:</p>
    <div class="grid cols-2">
      <button onclick="selectSub(1500, '15 Days')">₹1500 - 15 Days</button>
      <button onclick="selectSub(3000, '30 Days')">₹3000 - 30 Days</button>
    </div>
    <br><button onclick="renderServiceSelection()">Back</button></section>`;
}
function selectSub(price, plan) { state.pendingOrder.subscription = { price, plan }; renderMealTypes(); }

function renderMealTypes() {
  app.innerHTML = `<section class="card"><h2>Meal Types</h2>
    <label>Meal Type</label>
    <select id="mealType">
      <option value="Eco Meal (5 items)">Eco Meal (5 items) - Low Price</option>
      <option value="Regular Tiffin (8 items)">Regular Tiffin (8 items)</option>
    </select>
    <label>Customizable Menu (optional)</label>
    <textarea id="customMenu" rows="4" placeholder="Ex: 2 chapati, dal, paneer, salad"></textarea>
    <button class="primary" onclick="goPayment('regular')">Continue to Payment</button>
  </section>`;
}

function renderCorporate() {
  app.innerHTML = `<section class="card"><h2>Corporate Meal Service</h2>
  <p>Specialized office meal planning with recurring delivery slots.</p>
  <input id="corpCompany" placeholder="Company Name"/>
  <input id="corpCount" type="number" placeholder="Approx Meal Count per day"/>
  <input id="corpContact" placeholder="Contact Number"/>
  <button class="primary" onclick="goPayment('corporate')">Submit & Proceed to Payment</button>
  <br><br><button onclick="renderServiceSelection()">Back</button></section>`;
}

function renderCatering() {
  app.innerHTML = `<section class="card"><h2>Catering Service</h2>
  <p>For weddings, parties, and family events.</p>
  <input id="catOccasion" placeholder="Occasion"/>
  <input id="catGuests" type="number" placeholder="Number of Guests"/>
  <input id="catDate" type="date"/>
  <button class="primary" onclick="goPayment('catering')">Submit & Proceed to Payment</button>
  <br><br><button onclick="renderServiceSelection()">Back</button></section>`;
}

function renderBulkOrdering() {
  const options = bulkFoodItems.map(i => `<option value="${i.item} - ₹${i.rate}">${i.item} - ₹${i.rate}</option>`).join('');
  app.innerHTML = `<section class="card"><h2>Bulk Ordering Service</h2>
    <input id="bulkName" placeholder="Name of the consumer" value="${state.currentUser.name || ''}"/>
    <input id="bulkPhone" placeholder="Phone number of the consumer" value="${state.currentUser.phone || ''}"/>
    <input id="bulkAddress" placeholder="Address of consumer"/>
    <label>Food Items and Rates</label>
    <select id="bulkItems" multiple size="6">${options}</select>
    <p class="small">Use Ctrl/Cmd + click to select multiple items.</p>
    <button class="primary" onclick="goPayment('bulk')">Continue to Payment</button>
    <br><br><button onclick="renderServiceSelection()">Back</button>
  </section>`;
}

function goPayment(type) {
  const p = state.pendingOrder;
  if (type === 'regular') { p.mealType = mealType.value; p.customMenu = customMenu.value; p.amount = p.subscription.price; }
  if (type === 'corporate') { p.details = { company: corpCompany.value, count: corpCount.value, contact: corpContact.value }; p.amount = 5000; }
  if (type === 'catering') { p.details = { occasion: catOccasion.value, guests: catGuests.value, date: catDate.value }; p.amount = 8000; }
  if (type === 'bulk') {
    p.details = { name: bulkName.value, phone: bulkPhone.value, address: bulkAddress.value, items: [...bulkItems.selectedOptions].map(o => o.value) };
    p.amount = 3500;
  }
  app.innerHTML = `<section class="card"><h2>Payment Gateway</h2>
    <p>Payable Amount: <strong>₹${p.amount}</strong></p>
    <input id="payCard" placeholder="Card Number"/>
    <div class="grid cols-2"><input id="payExpiry" placeholder="MM/YY"/><input id="payCvv" placeholder="CVV"/></div>
    <button class="success" onclick="completePayment()">Pay Now</button>
  </section>`;
}

function completePayment() {
  state.pendingOrder.id = 'ORD' + Date.now();
  state.pendingOrder.createdAt = new Date().toISOString();
  state.orders.unshift(state.pendingOrder); state.pendingOrder = null; save();
  alert('Payment successful & order placed.');
  renderServiceSelection();
}

function renderOwner() {
  const byService = ['Regular Meal Service', 'Corporate Meal Service', 'Bulk Ordering Service', 'Catering Service']
    .map(s => ({ s, count: state.orders.filter(o => o.service === s).length }));
  app.innerHTML = `<section class="card"><h2>Owner Dashboard</h2><button onclick="logout()">Logout</button>
    <div class="grid cols-4">${byService.map(x => `<div class='stat'><strong>${x.count}</strong><br>${x.s}</div>`).join('')}</div>
    <h3>All Orders & Controls</h3>${renderOrders(true)}</section>`;
}

function renderManagerOperator(role) {
  app.innerHTML = `<section class="card"><h2>${role.toUpperCase()} Dashboard</h2><button onclick="logout()">Logout</button>
  <p>Received orders with customer details and operational controls.</p>
  ${renderOrders(false)}
  </section>`;
}

function renderOrders(ownerControls) {
  return state.orders.map(o => `<div class="order"><div><span class="badge">${o.status}</span> ${o.id} | ${o.service}</div>
  <div class="small">Customer: ${o.user?.name || 'NA'} | ${o.user?.email || 'NA'} | ${o.user?.phone || 'NA'}</div>
  <div class="small">Amount: ₹${o.amount || 0}</div>
  ${ownerControls ? `<div class='grid cols-2'><button onclick="setStatus('${o.id}','Accepted')">Accept</button><button class='danger' onclick="setStatus('${o.id}','Rejected')">Reject</button></div>` : `<button onclick="setStatus('${o.id}','Processing')">Mark Processing</button>`}
  </div>`).join('') || '<p>No orders yet.</p>';
}

function setStatus(id, status) { const o = state.orders.find(x => x.id === id); if (o) o.status = status; save(); render(); }

function render() {
  if (!state.currentUser) return renderAboutLogin();
  if (state.currentUser.role === 'owner') return renderOwner();
  if (state.currentUser.role === 'manager' || state.currentUser.role === 'operator') return renderManagerOperator(state.currentUser.role);
  return renderServiceSelection();
}

render();
