const express = require('express');
const cors = require('cors');
const { pool, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initDatabase().catch(console.error);

// Helper function to transform database row to API format
function transformCustomer(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || '',
    company: row.company || '',
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
  };
}

// Routes

// Get all active customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );
    const customers = result.rows.map(transformCustomer);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all deleted customers
app.get('/api/customers/deleted', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC'
    );
    const deletedCustomers = result.rows.map(transformCustomer);
    res.json(deletedCustomers);
  } catch (error) {
    console.error('Error fetching deleted customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND deleted_at IS NULL',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const customer = transformCustomer(result.rows[0]);
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  const { name, email, phone, company } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO customers (name, email, phone, company)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, email, phone || '', company || '']);

    const newCustomer = transformCustomer(result.rows[0]);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  const { name, email, phone, company } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(`
      UPDATE customers 
      SET name = $1, email = $2, phone = $3, company = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND deleted_at IS NULL
      RETURNING *
    `, [name, email, phone || '', company || '', req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const updatedCustomer = transformCustomer(result.rows[0]);
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Soft delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE customers 
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Restore deleted customer
app.post('/api/customers/restore/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE customers 
      SET deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NOT NULL
      RETURNING *
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deleted customer not found' });
    }

    const restoredCustomer = transformCustomer(result.rows[0]);
    res.json(restoredCustomer);
  } catch (error) {
    console.error('Error restoring customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Permanently delete customer
app.delete('/api/customers/permanent/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      DELETE FROM customers 
      WHERE id = $1 AND deleted_at IS NOT NULL
      RETURNING *
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deleted customer not found' });
    }

    res.json({ message: 'Customer permanently deleted' });
  } catch (error) {
    console.error('Error permanently deleting customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CRM Backend server running on port ${PORT}`);
});