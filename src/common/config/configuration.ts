import * as Joi from 'joi';

export default () => ({
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});

export const configValidationSchema = Joi.object({
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
