const transporter = require("../config/mailConfig");
const Contact = require("../models/Contact");
const validator = require("validator");

exports.submitContactForm = async (req, res) => {
  try {
    //fetch data from req body
    const { name, email, number, message } = req.body;

    //validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    //validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    //validate number
    if (number && !validator.isNumeric(number)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid contact number.",
      });
    }

    // Check if the email already exists in the database
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already registered. Please use a different email.",
      });
    }

    //Save the contact form data to the database
    const newContact = new Contact({ name, email, number, message });
    await newContact.save();

    //set up email options for the user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Contact Form Submission Confirmation",
      html: `Hello <b>${name}</b>,<br><br>Thank you for reaching out! We have received your message:<br><br>"${message}"`,
    };

    // Set up email options for the admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to your admin email
      subject: "New Contact Form Submission",
      html: `You have received a new message from <b>${name}</b> (${email}):<br><br>"${message}"<br><br>Contact Number: <b>${number}</b>`,
    };

    //send confirmation email to the user
    await transporter.sendMail(userMailOptions);

    //send confirmation email to the admin
    await transporter.sendMail(adminMailOptions);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to send message. Please try again later.",
    });
  }
};
