import { Router } from "express";
import { authentication } from "../../../middleware/auth.muddleware.js";
import * as profileService from "./Service/user.service.js";
import { validationData } from "../../../middleware/Validation.js";
import * as validator from "./user.validation.js";
import {
  fileValidation,
  uploadFileDisk,
} from "../../../utils/multer/local.multer.js";
import { uploadCloudFile } from "../../../utils/multer/cloud.multer.js";
const router = Router();
router.get("/profile/dashboard",authentication(),profileService.dashboard)
router.get("/profile", authentication(), profileService.profile);
router.patch(
  "/profile",
  validationData(validator.updateProfile),
  authentication(),
  profileService.updateProfile
);
router.patch(
  "/profile/image",
  authentication(),
  uploadFileDisk("user/profile", fileValidation.image).single("attachment"),
  validationData(validator.profileImage),profileService.updateProfileImage
);
router.patch(
  "/profile/image/cloud",
  authentication(),
  uploadCloudFile( fileValidation.image).single("attachment"),
  validationData(validator.profileImage),profileService.updateProfileImageCloud
);
router.patch(
  "/profile/image/cover",
  authentication(),
  uploadFileDisk("user/profile", fileValidation.image).array("attachment",5),
  profileService.updateProfileImageCover
);
router.patch(
  "/profile/image/cover/cloud",
  authentication(),
  uploadFileDisk( fileValidation.image).array("attachment",5),
  profileService.updateProfileImageCoverCloud
);

router.get(
  "/profile/:profileId",
  validationData(validator.showProfile),
  authentication(),
  profileService.shareProfile
);
router.patch(
  "/profile/email",
  validationData(validator.updateEmail),
  authentication(),
  profileService.updateEmail
);
router.patch(
  "/profile/resetEmail",
  validationData(validator.resetEmail),
  authentication(),
  profileService.resetEmail
);
router.patch(
  "/profile/password",
  validationData(validator.updatePassword),
  authentication(),
  profileService.updatePassword
);
export default router;
