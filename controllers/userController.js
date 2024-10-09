import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";



// 1. Create a new user
export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Created successfully, please login to continue",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2. Login a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(409)
        .json({ success: false, message: "User Not Found" });
    }
    const validUser = await bcryptjs.compare(password, user.password);
    if (!validUser) {
      return res
        .status(409)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ success: true, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3. Get current user
export const getCurrentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Welcome back!", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 4. Logout a user
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("access_token");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// 5. Google Auth
export const googleLogin = async (req, res) => {
  const { email, name, profileUrl } = req.user; // Extract info from the request
  try {
    // Check if the user already exists in the database
    let existingUser = await User.findOne({ email }).select("-password");

    if (existingUser) {
      // User exists, return user data
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: existingUser,
      });
    } else {
      // User does not exist, create a new user
      const hashedPassword = await bcryptjs.hash("password123", 10); // Hash a default password
      const newUser = new User({ ...req.user, password: hashedPassword }); // Create a new user instance

      await newUser.save(); // Save the new user to the database
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("Error in handleUserData:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 6. Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password");
    res
      .status(200)
      .json({ success: true, message: "Profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 7. forgot password
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL,
      to: "avinashakg1998@gmail.com", //user.email
      subject: "Reset Password",
      html: `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                  <!-- Company Logo -->
                  <div style="text-align: center;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/invocify-4cc5a.appspot.com/o/companylogo.png?alt=media&token=96325f6d-2fbe-495b-b8ee-3332a196c0c1" alt="Company Logo" style="width: 150px;">
                    <h3>Team Invocify</h3>
                  </div>
        
                  <!-- Email Greeting -->
                  <h2 style="text-align: center; color: #4CAF50;">Reset Your Password</h2>
        
                  <!-- Main Body -->
                    <p>Hello,</p>
                    <p>You recently requested to reset your password for your account. Click the button below to reset it. If you did not request a password reset, please ignore this email.</p>
        
                  <!-- Call to Action Button -->
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="http://localhost:5173/auth/reset-password/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Your Password</a>
                  </div>
        
                  <!-- Security Reminder -->
                  <p style="color: #999;">If you didn't request a password reset, you can safely ignore this email. Your password won't be changed unless you click the link above.</p>
        
                  <!-- Footer -->
                  <div style="border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
                    <p>If you have any questions, feel free to contact us at <a href="mailto:support@yourcompany.com">support@invocify.com</a>.</p>
                    <p>&copy; 2024 Invocify</p>
                  </div>
                </div>
              </div>
              `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send({ success: false, message: "Email not sent" });
      } else {
        res.send({ success: true, message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
}


// 8. Reset password

export async function resetPassword(req, res,next) {
  try {
      const token = req.params.token;
      const { password } = req.body;

      if (!token) {
          return res.send({ success: false, message: "Token not found" });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the user exists
      const user = await User.findById(decoded.userId);
      if (!user) {
          return res.send({ success: false, message: "User not found" });
      }

      // Hash the new password
      const hashedPassword = bcryptjs.hashSync(password, 10);

      // Update the user's password
      await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: "avinashakg1998@gmail.com", // user.email
        subject: "Password Reset Successful",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              
              <!-- Company Logo -->
              <div style="text-align: center;">
                <img src="https://firebasestorage.googleapis.com/v0/b/invocify-4cc5a.appspot.com/o/companylogo.png?alt=media&token=96325f6d-2fbe-495b-b8ee-3332a196c0c1" alt="Company Logo" style="width: 150px;">
                <h3>Team Invocify</h3>
              </div>
      
              <!-- Email Greeting -->
              <h2 style="text-align: center; color: #4CAF50;">Password Reset Successful</h2>
      
              <!-- Main Body -->
              <p>Hello,</p>
              <p>Your password has been successfully reset. You can now log in using your new password.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:5173/auth/" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Log In</a>
              </div>
      
              <!-- Reminder -->
              <p>If you didn’t reset your password or believe this was done in error, please contact our support team immediately.</p>
      
              <!-- Footer -->
              <div style="border-top: 1px solid #eaeaea; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
                <p>If you have any questions, feel free to contact us at <a href="mailto:support@invocify.com">support@invocify.com</a>.</p>
                <p>&copy; 2024 Invocify</p>
              </div>
            </div>
          </div>
        `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send({ success: false, message: "Email not sent" });
        } else {
          res.send({ success: true, message: "Email sent successfully" });
        }
      });

      // Respond with success
      res.send({ success: true, message: "Password reset successfully" });
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          return res.send({ success: false, message: "Token has expired" });
      }
      if (error.name === 'JsonWebTokenError') {
          return res.send({ success: false, message: "Invalid token" });
      }
      res.status(500).send({ success: false, message: "Internal server error" });
  }
}