import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

env.config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(express.json());

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PWD,
    port: process.env.PG_PORT,
});

db.connect();

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting attachment file:', err);
    }
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/index", (req, res) => {
    res.render("index.ejs");
});

app.get("/work", (req, res) => {
    res.render("work.ejs");
});

app.get("/work/conceptart", (req,res) => {
    res.render("conceptart.ejs");
});

app.get("/work/digital", (req,res) => {
    res.render("digital.ejs");
});

app.get('/work/animated', (req, res) => {
  res.render('animated.ejs');
});

app.get("/work/sketchbook", (req,res) => {
    res.render("sketchbook.ejs");
});

app.get("/work/traditional", (req,res) => {
    res.render("traditional.ejs");
});

app.get('/work/canvas', (req, res) => {
  res.render('canvas.ejs');
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});
/*
app.post('/subscribe', async (req, res) => {
  const { fName, lName, email } = req.body;

  console.log('Received data:', req.body); // Log received data

  try {
    const checkUser = await db.query(
      'SELECT * FROM testsubscribers WHERE email = $1',
      [email],
    );
    if (checkUser.rows.length > 0) {
      // User is already registered
      res.json({
        success: false,
      });
    } else {
      // New user registered
      await db.query(
        'INSERT INTO testsubscribers (first_name, last_name, email) VALUES ($1, $2, $3)',
        [fName, lName, email],
      );
      res.json({
        success: true,
      });
    }
  } catch (err) {
    console.error('Error inserting subscriber into database:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
});*/

app.get("/contact", (req, res) => {
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
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        deleteFile(path.join(__dirname, attachment.path));
      }
      return res.json({
        success: true,
        message: "Thanks for reaching out! I'll get back to you soon!",
      });
    }
  });
});

app.listen(port, ()=>{
    console.log(`Server running on port: ${port}`);
});