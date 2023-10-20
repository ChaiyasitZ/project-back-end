const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

// const dbUrl = 'postgres://webadmin:VTTboo64357@node52114-project-advcompro.proen.app.ruk-com.cloud:11565/postgres';

// const sequelize = new Sequelize(dbUrl);

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/SQBooks.sqlite'
});

const Book = sequelize.define('Book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    },
    title: { 
        type: Sequelize.STRING, 
        allowNull: false 
    },
    author: { 
        type: Sequelize.STRING, 
        allowNull: false 
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publicationYear: {
        type: Sequelize.INTEGER,
        defaultValue: sequelize.NOW
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
});

const Customer = sequelize.define('Customer', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    emailAddress: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true   
    },
    phoneNumber: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
    },   
    shippingAddress: {
        type: Sequelize.STRING,
        allowNull: false
    },
    billingAddress: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const Order = sequelize.define('Order', {
    totalAmount: { 
        type: Sequelize.FLOAT,
        allowNull: false},
    status: { 
        type: Sequelize.STRING, 
        defaultValue: 'Processing',
        allowNull: false }
});

Customer.hasMany(Order); // A customer can have many orders
Order.belongsTo(Customer); // An order belongs to a customer
Order.belongsToMany(Book, { through: 'OrderBooks' }); // An order can have many books
Book.belongsToMany(Order, { through: 'OrderBooks' }); // A book can have many orders
sequelize.sync().then(() => 
    console.log('Database and tables are synced.')); // Connect to the database and create tables

// Get all books
app.get('/books', async (req, res) => {
  try { 
    res.json(await Book.findAll()); 
    } catch (error) { 
        res.status(500).json({ error: 'Unable to retrieve books.' }); }
});

// Get a book by ID
app.get('/books/:bookId', async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found.' });
      } else {
        res.json(book);
      }
    } catch (error) {
      res.status(500).json({ error: 'Unable to retrieve the book.' });
    }
});

// Create a new book
app.post('/books', async (req, res) => {
    try { 
        res.status(201).json(await Book.create(req.body));
    } catch (error) {
        res.status(400).json({ error: 'Unable to create the book.' });
    }
});
  
// Update a book by ID
app.put('/books/:bookId', async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found.' });
      } else {
        await book.update(req.body);
        res.json(book);
      }
    } catch (error) {
      res.status(400).json({ error: 'Unable to update the book.' });
    }
});
  
// Delete a book by ID
app.delete('/books/:bookId', async (req, res) => {
    try {
      const book = await Book.findByPk(req.params.bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found.' });
      } else {
        await book.destroy();
        res.send('Book deleted successfully.');
      }
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete the book.' });
    }
});

// Create a new customer
app.post('/customers', async (req, res) => {
    try {
        res.status(201).json(await Customer.create(req.body));
    } catch (error) {
        res.status(400).json({ error: 'Unable to create the customer.' });
    }
});

// Get all customers
app.get('/customers', async (req, res) => {
  try { 
    res.json(await Customer.findAll()); 
    } catch (error) { 
        res.status(500).json({ error: 'Unable to retrieve customers.' }); }
});

// Get a customer by ID
app.get('/customers/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.customerId);
        if (!customer) {
            res.status(404).json({ error: 'Customer not found.' });
        } else {
            res.json(customer);
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve the customer.' });
    }
});

// Update a customer by ID
app.put('/customers/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.customerId);
        if (!customer) {
            res.status(404).json({ error: 'Customer not found.' });
        } else {
            await customer.update(req.body);
            res.json(customer);
        }
    } catch (error) {       
        res.status(400).json({ error: 'Unable to update the customer.' });
    }
});

// Delete a customer by ID
app.delete('/customers/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;

        // Use Sequelize to find the customer by ID
        const customer = await Customer.findByPk(customerId);

        if (!customer) {
            res.status(404).json({ error: 'Customer not found.' });
        } else {
            // Delete the customer
            await customer.destroy();
            res.send('Customer deleted successfully.');
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete the customer.' });
    }
});

// Create a new order 
app.post('/orders', async (req, res) => {
  try { 
    res.status(201).json(await Order.create(req.body)); }
  catch (error) { r
    es.status(400).json({ error: 'Unable to create the order.' }); }
});

// Retrieve all orders
app.get('/orders', async (req, res) => {
  try { 
    res.json(await Order.findAll()); }
  catch (error) { 
    res.status(500).json({ error: 'Unable to retrieve orders.' }); }
});

// Retrieve a specific order by ID
app.get('/orders/:orderId', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            res.status(404).json({ error: 'Order not found.' });
        } else {
            res.json(order);
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to retrieve the order.' });
    }
});

// Update an order's information by ID
app.put('/orders/:orderId', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            res.status(404).json({ error: 'Order not found.' });
        } else {
            await order.update(req.body);
            res.json(order);
        }
    } catch (error) {
        res.status(400).json({ error: 'Unable to update the order.' });
    }
});

// Delete an order by ID
app.delete('/orders/:orderId', async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            res.status(404).json({ error: 'Order not found.' });
        } else {
            await order.destroy();
            res.send('Order deleted successfully.');
        }
    } catch (error) {
        res.status(500).json({ error: 'Unable to delete the order.' });
    }
});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
