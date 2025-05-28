const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact Form Submission
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Save to database
    const contact = await prisma.contact.create({
      data: { name, email, phone, subject, message }
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      success: true,
      message: 'Contact form submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
};

// Enquiry Form Submission
const submitEnquiry = async (req, res) => {
  try {
    const { productId, quantity, unit, additionalInfo, phone } = req.body;

    // Validate required fields
    if (!productId || !quantity || !unit || !phone) {
      return res.status(400).json({ error: 'Product, quantity, unit, and phone are required' });
    }

    // Get product details
    const product = await prisma.machine.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Save enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        unit,
        additionalInfo,
        phone
      },
      include: { product: true }
    });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SALES_EMAIL,
      subject: `New Product Enquiry: ${product.name}`,
      html: `
        <h3>New Product Enquiry</h3>
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Quantity:</strong> ${quantity} ${unit}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Additional Info:</strong> ${additionalInfo || 'None'}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ 
      success: true,
      message: 'Enquiry submitted successfully',
      enquiry
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    res.status(500).json({ error: 'Failed to submit enquiry' });
  }
};

module.exports = { submitContact, submitEnquiry };