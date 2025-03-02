import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().required().min(3).max(100),
  email: Joi.string().required().email(),
  password: Joi.string()
    .required()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .message(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  role: Joi.string().valid("user", "admin").default("user"),
});

export const loginValidation = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
