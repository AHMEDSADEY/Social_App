import { Router } from "express";
import * as registarServices from "./auth.services.js"
  import * as validator from "./auth.validation.js"
import { validationData } from "../../../middleware/Validation.js";
import { asyncHandler } from "../../../utils/error/error.response.js";
const router = Router()
router.post("/signUp",validationData(validator.signUp),asyncHandler( registarServices.signUp))
router.patch("/confirmEmail",validationData(validator.confirmEmail),asyncHandler( registarServices.confirmEmail))
router.post("/login",validationData(validator.login),asyncHandler(registarServices.login))
router.post("/loginWithGmail",asyncHandler(registarServices.loginWithGmail))
router.patch("/forgotPassword",validationData(validator.forogtPassword),asyncHandler(registarServices.forgotPassword))
router.patch("/validateForgotPassword",validationData(validator.validateForgotPassword),asyncHandler(registarServices.validateForgotPassword))
router.patch("/resetPassword",validationData(validator.resetPassword),asyncHandler(registarServices.resetPassword))
router.get("/refreh-token",asyncHandler(registarServices.refrehToken) )
export default router