import * as postServices from "../Post/Service/post.service.js";
import * as validators from "./post.validation.js";
import { endPoint } from "./post.authorizathon.js";
import { Router } from "express";
const router = Router();

import {
  authentication,
  authorization,
} from "../../middleware/auth.muddleware.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { fileValidation } from "../../utils/multer/local.multer.js";
import { validationData } from "../../middleware/Validation.js";
import commentController from "../Comment/Comment.controller.js"
import { rolesType } from "../../DB/model/User.model.js";
router.use('/:postId/comment',commentController )
router.get("/",  authentication(),
  authentication(),
postServices.getPosts)
router.post("/",  authentication(),authorization(endPoint.createPost),
uploadCloudFile(fileValidation.image).array("attachment", 2),
validationData(validators.createPost),
postServices.createPost)
router.patch("/:postId",  authentication(),
uploadCloudFile(fileValidation.image).array("attachment", 2),
validationData(validators.updatePost),
postServices.updatePost)
router.delete("/:postId",  authentication(),
validationData(validators.freazePost),
postServices.freazePost)
router.patch("/:postId/restore",  authentication(),
validationData(validators.freazePost),
postServices.unFreazePost)
router.patch("/:postId/like",  authentication(),
validationData(validators.likePost),
postServices.likePost)
router.patch("/:postId/unlike",  authentication(),
validationData(validators.likePost),
postServices.unlikePost)
export default router;
