const Joi = require("@hapi/joi");

const RegisterSchema = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

const LoginSchema = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.RegisterSchema = RegisterSchema;
module.exports.LoginSchema = LoginSchema;
