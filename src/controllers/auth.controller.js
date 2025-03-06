import User from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered!" });
    }

    const user = new User(req.body);
    user.save();

    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "user registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user || !user.isPasswordMatch(req.body.password)) {
      return res.status(401).json({ message: "Invalid Email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, payload });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Login failed" });
  }
};
