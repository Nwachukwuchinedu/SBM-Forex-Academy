import Joi from "joi";
import xss from "xss";

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // XSS Sanitize
  req.body.firstName = xss(req.body.firstName);
  req.body.lastName = xss(req.body.lastName);
  req.body.email = xss(req.body.email);

  next();
};

export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  req.body.email = xss(req.body.email);

  next();
};
