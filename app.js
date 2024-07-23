const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to the PostgreSQL database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database');
  }
});

// Delete attachment afer sending mail
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting attachment file:', err);
    }
  });
};

// Setting up Transporter for sending mails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/index', (req, res) => {
  res.render('index.ejs');
});

app.get('/commissions', (req, res) => {
  res.render('commissions.ejs');
});

app.get('/work/conceptart', (req, res) => {
  res.render('conceptart.ejs');
});

app.get('/work/digital', (req, res) => {
  res.render('digital.ejs');
});

app.get('/work/animated', (req, res) => {
  res.render('animated.ejs');
});

app.get('/work/sketchbook', (req, res) => {
  res.render('sketchbook.ejs');
});

app.get('/work/traditional', (req, res) => {
  res.render('traditional.ejs');
});

app.get('/work/canvas', (req, res) => {
  res.render('canvas.ejs');
});

app.get('/about', (req, res) => {
  res.render('about.ejs');
});

app.post('/subscribe', async (req, res) => {
  const { fName, lName, email } = req.body;

  if (!fName || !lName || !email) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the user is already subscribed
    const checkUserQuery = 'SELECT * FROM test WHERE email = $1';
    const checkUserResult = await client.query(checkUserQuery, [email]);

    if (checkUserResult.rows.length > 0) {
      return res
        .status(200)
        .json({ success: false, message: 'You have already subscribed!' });
    }

    // Insert the new subscriber into the database
    const insertUserQuery =
      'INSERT INTO test (first_name, last_name, email) VALUES ($1, $2, $3)';
    await client.query(insertUserQuery, [fName, lName, email]);

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing!',
    });
  } catch (error) {
    console.error('Error subscribing user:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.',
    });
  }
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
});

app.post('/contact/message', upload.single('attachment'), (req, res) => {
  const { fName, lName, email, subject, message } = req.body;
  const attachment = req.file;

  console.log(
    'FName:',
    fName,
    'LName:',
    lName,
    'Email:',
    email,
    'Subject:',
    subject,
  );
  console.log('Attachment:', attachment);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject,
    text: `Message from ${fName} ${lName}\nContact-Info: ${email}\n\n${message}`,
    attachments: attachment
      ? [
          {
            filename: attachment.originalname,
            path: attachment.path,
            contentType: attachment.mimetype,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    } else {
      console.log('Email sent:', info.response);
      if (attachment) {
        const __dirname = path.dirname(__filename);
        deleteFile(path.join(__dirname, attachment.path));
      }
      return res.json({
        success: true,
        message: "Thanks for reaching out! I'll get back to you soon!",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
