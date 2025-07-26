import joi from "joi"
import { genralValidation } from "../../../middleware/Validation.js"
export const signUp = joi.object().keys({
  userName:genralValidation.userName.required(),
  email:genralValidation.email.required(),
  password:genralValidation.password.required(),
  confirmPassword:genralValidation.confirmPassword,
}).required()
export const confirmEmail = joi.object().keys({
  email:genralValidation.email.required(),
  code:genralValidation.code.required()
}).required()
export const login = joi.object().keys({
  email:genralValidation.email.required(),
  password:genralValidation.password.required(),
}).required()
export const forogtPassword = joi.object().keys({
  email:genralValidation.email.required(),
}).required()
export const validateForgotPassword = joi.object().keys({
  email:genralValidation.email.required(),
  code:genralValidation.code.required(),
}).required()
export const resetPassword = joi.object().keys({
  email:genralValidation.email.required(),
  code:genralValidation.code.required(),
  password:genralValidation.password.required(),
  confirmPassword:genralValidation.confirmPassword.valid(joi.ref('password')).required()
}).required()