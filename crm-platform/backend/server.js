const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for customers
let activeCustomers = [
  {
    id: uuidv4(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-0123',
    company: 'ABC Corp',
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1-555-0456',
    company: 'XYZ Inc',
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let deletedCustomers = [];

// Routes

// Get all active customers
app.get('/api/customers', (req, res) => {
  res.json(activeCustomers);
});

// Get all deleted customers
app.get('/api/customers/deleted', (req, res) => {
  res.json(deletedCustomers);
});

// Get customer by ID
app.get('/api/customers/:id', (req, res) => {
  const customer = activeCustomers.find(c => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

// Create new customer
app.post('/api/customers', (req, res) => {
  const { name, email, phone, company } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newCustomer = {
    id: uuidv4(),
    name,
    email,
    phone: phone || '',
    company: company || '',
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  activeCustomers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const customerIndex = activeCustomers.findIndex(c => c.id === req.params.id);
  
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const { name, email, phone, company } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  activeCustomers[customerIndex] = {
    ...activeCustomers[customerIndex],
    name,
    email,
    phone: phone || '',
    company: company || '',
    updatedAt: new Date().toISOString()
  };

  res.json(activeCustomers[customerIndex]);
});

// Soft delete customer (move to deleted customers)
app.delete('/api/customers/:id', (req, res) => {
  const customerIndex = activeCustomers.findIndex(c => c.id === req.params.id);
  
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const deletedCustomer = {
    ...activeCustomers[customerIndex],
    deletedAt: new Date().toISOString()
  };

  deletedCustomers.push(deletedCustomer);
  activeCustomers.splice(customerIndex, 1);

  res.json({ message: 'Customer deleted successfully' });
});

// Restore deleted customer
app.post('/api/customers/restore/:id', (req, res) => {
  const customerIndex = deletedCustomers.findIndex(c => c.id === req.params.id);
  
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Deleted customer not found' });
  }

  const restoredCustomer = { ...deletedCustomers[customerIndex] };
  delete restoredCustomer.deletedAt;
  restoredCustomer.updatedAt = new Date().toISOString();

  activeCustomers.push(restoredCustomer);
  deletedCustomers.splice(customerIndex, 1);

  res.json(restoredCustomer);
});

// Permanently delete customer
app.delete('/api/customers/permanent/:id', (req, res) => {
  const customerIndex = deletedCustomers.findIndex(c => c.id === req.params.id);
  
  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Deleted customer not found' });
  }

  deletedCustomers.splice(customerIndex, 1);
  res.json({ message: 'Customer permanently deleted' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CRM Backend server running on port ${PORT}`);
});