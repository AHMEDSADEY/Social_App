import joi from "joi";
import { genralValidation } from "../../../middleware/Validation.js";
export const showProfile = joi.object().keys({
  profileId:genralValidation.id.required()
}).required()
export const updateEmail = joi.object().keys({
  email:genralValidation.email.required()
}).required()
export const resetEmail = joi.object().keys({
  oldCode:genralValidation.code.required(),
  newCode:genralValidation.code.required()
}).required()
export const updatePassword = joi.object().keys({
  oldPassword:genralValidation.password.required(),
  password:genralValidation.password.not(joi.ref("oldPassword")).required(),
  confirmPassword:genralValidation.confirmPassword.valid(joi.ref("password")).required(),
}).required()
export const updateProfile = joi.object().keys({
  userName:genralValidation.userName,
  address:genralValidation.address,
  DOB:genralValidation.DOB,
  phone:genralValidation.phone
})
export const profileImage = joi.object().keys({
  file:genralValidation.file.required()
}).required()
