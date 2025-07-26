import joi from "joi"
import { genralValidation } from "../../middleware/Validation.js"
export const createPost = joi.object().keys({
  content:joi.string().min(2).max(5000).trim(),
  file:joi.array().items(genralValidation.file)
}).or("content","file")
export const updatePost = joi.object().keys({
  postId:genralValidation.id.required(),
  content:joi.string().min(2).max(5000).trim(),
  file:joi.array().items(genralValidation.file)
}).or("content","file")
export const freazePost = joi.object().keys({
  postId:genralValidation.id.required()
}).required()

export const likePost = freazePost