import User from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { loginValidation, registerValidation } from "../validation/user.validation.js";
import { mailer } from "../infrastructure/services/index.js";

export const register = async (req, res) => {
  
  const {error} = registerValidation.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

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


    mailer.welcome(user)

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
    res.status(500).json({ message: `Registration failed:  ${error.message}` });
  }
};

export const login = async (req, res) => {
  const {error} = loginValidation.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user || !(await user.isPasswordMatch(req.body.password))) {
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

    res.status(200).json({ 
      message: "Login successful", 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Login failed" });
  }
};
