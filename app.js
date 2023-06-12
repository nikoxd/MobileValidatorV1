// ----------------     Mobile Number Validator      ----------------  //
//                       Backend and Frontend                         //

// Files: web.html / app.js / admin.html //
// Used in: Node.js, React, MongoDB (mongoose), nodemailer(for Emailing) //
// HTML5 / CSS styles included //
// Email was added as an add-on for the webpage //
// Author / Developer : " Muhammad Ghassan El Assaad" // 
// Date : 13 June / 2023 //

// --------------------------------------------------------------------//


const express = require('express');
const mongoose = require ("mongoose"); 
const app = express();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const port = 3000;

// Connect to MongoDB Create your own db for testing, the one i used in cdb.customer
mongoose.connect('mongodb://localhost:27017/CDB.customer', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create a customer schema
const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  location: String,
});

// Create a customer model
const Customer = mongoose.model('Customer', customerSchema);

// Enable parsing of JSON data
app.use(bodyParser.json());

// Serve the HTML file
app.use(express.static('test'));

// Handle POST request to add a new customer
app.post('/customer', async (req, res) => {
  try {
    // Create a new customer object from the request body
    const customer = new Customer(req.body);

    // Save the customer to the database
    await customer.save();

    // Send the customer ID as the response
    res.json({ id: customer._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//CUSTOMERS PART

// Handle GET request to retrieve customer information by ID
app.get('/customer/:id', async (req, res) => {
  try {
    // Find the customer by ID
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Send the customer information as the response
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Handle DELETE request to delete customer by ID
app.delete('/customer/:id', async (req, res) => {
  try {
    // Find the customer by ID and remove it
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Send a success message as the response
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Handle PUT request to update customer information by ID
app.put('/customer/:id', async (req, res) => {
  try {
    // Find the customer by ID and update its information
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Send the updated customer information as the response
    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//EMAIL Sending PART (Add-on)

// Endpoint to handle sending the email
app.post('/send-message', (req, res) => {
  const email = req.body.email;
  const message = req.body.message;

  // Check if the email and message are present
  if (!email || !message) {
    return res.status(400).json({ error: 'Please fill in your email address and your message correctly!' });
  }

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your_email@gmail.com', // Replace with your Gmail email address
      pass: 'your_password' // Replace with your Gmail password
    }
  });

  // Define the email options
  const mailOptions = {
    from: 'your_email@gmail.com', // Replace with your Gmail email address
    to: 'mythunterblack@gmail.com', // Replace with the email address you want to receive the message
    subject: 'New Message',
    text: `Email: ${email}\n\nMessage: ${message}`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'An error occurred while sending the message.' });
    }
    console.log('Message sent:', info.response);
    res.sendStatus(200);
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
