import { asyncHandler } from "../../../../utils/error/error.response.js";
import { successResponse } from "../../../../utils/response/successResponse.js";
import * as dbServices from "../../../../DB/db.services.js";
import { User } from "../../../../DB/model/User.model.js";
import { emailEvent } from "../../../../utils/email/emailevent.js";
import { genrateCompare, genrateHash } from "../../../../utils/security/hash/hash.security.js";
import { cloud } from "../../../../utils/multer/cloudinary.multer.js";
import path from "node:path";
export const dashboard = asyncHandler(async (req, res, next) => {
  const user = await dbServices.find({
    model: User,
    filter: {  },
    populate:[{
      path:"viewers.userId",
      select:"userName Image"
    }]
  });
  return successResponse({ res, data: { user } });
});
export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbServices.findOneAndUpdate({
    model: User,
    filter: { _id: req.user_id },
    populate: [
      {
        path: "viewers.userId",
      },
    ],
  });
  return successResponse({ res, data: { user: req.user } });
});
export const updateProfile = asyncHandler(async (req, res, next) => {
  const user = await dbServices.findOneAndUpdate({
    model: User,
    filter: { _id: req.user_id },
    data:req.body,
    options:{new:true}
  });
  return successResponse({ res, data: { user } });
});
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;
  let user = null;
  if (profileId == req.user._id.toString()) {
    user = req.user;
  } else {
    user = await dbServices.findOneAndUpdate({
      model: User,
      filter: { _id: profileId, isDeleted: false },
      data: {
        $push: { viewers: { userId: req.user._id, time: Date.now() } },
      },
      select: "userName email image",
    });
  }
  return user
    ? successResponse({ res, data: { user } })
    : next(new Error("in-valid Account !"));
});
export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (await dbServices.findOne({ model: User, filter: { email } })) {
    return next(new Error("Email Already Exists !", { cause: 400 }));
  }
  await dbServices.updateOne({
    model: User,
    filter: { _id: req.user._id },
    data: { tempEmail: email },
  });
  emailEvent.emit("sendConfirmEmail", {
    id: req.user._id,
    email: req.user.email,
  });
  emailEvent.emit("UpdateEmail", { id: req.user._id, email });
  return successResponse({ res });
});
export const resetEmail = asyncHandler(async (req, res, next) => {
  const { oldCode, newCode } = req.body;
  if (
    !genrateCompare({
      plainText: oldCode,
      hashValue: req.user.confirmEmailOTP,
    }) ||
    !genrateCompare({ plainText: newCode, hashValue: req.user.tempEmailOTP })
  ) {
    return next(new Error("In-valid Code", { cause: 400 }));
  }
  await dbServices.updateOne({
    model: User,
    filter: { _id: req.user._id },
    data: { email: req.user.tempEmail, changeCridentialsTime: Date.now(),$unset:{
      tempEmail:0,
      confirmEmailOTP:0,
      resetPasswordOTP:0
    } },
  });
  return successResponse({ res });
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  if (
    !genrateCompare({plainText:oldPassword ,hashValue:req.user.password})
  ) {
    return next(new Error("In-valid Old Password", { cause: 400 }));
  }
  await dbServices.updateOne({
    model: User,
    filter: { _id: req.user._id },
    data: { email: req.user.tempEmail, changeCridentialsTime: Date.now(),$unset:{
      password:genrateHash({plainText:password})
    } },
  });
  return successResponse({ res });
});
export const updateProfileImage = asyncHandler(async(req,res,next)=>{
  const user = await dbServices.findOneAndUpdate({
    model: User,
    filter: { _id: req.user._id },
    data: {image:req.file.finalPath} ,
    options:{new:true}
  });
  return successResponse({ res,data:{file:req.file} });
})
export const updateProfileImageCover = asyncHandler(async(req,res,next)=>{
  const user = await dbServices.findOneAndUpdate({
    model: User,
    filter: { _id: req.user._id },
    data: {coverImage:req.files.map(file=>file.finalPath)} ,
    options:{new:true} 
  });
  return successResponse({ res,data:{user} });
})
export const updateProfileImageCloud = asyncHandler(async(req,res,next)=>{
  const {secure_url , public_id} = await cloud.uploader.upload(req.file.path, {folder:`${process.env.APP_Name}/user/${process.env.APP_Name}/profile`})
  const user = await dbServices.findOneAndUpdate({
    model: User,
    filter: { _id: req.user._id },
    data: {
    image:{secure_url , public_id}
    } ,
    options:{new:false}
  });
  if(user.image?.public_id){
    await cloud.uploader.destroy(user.image.public_id)
  }
  return successResponse({ res,data:{user} });
})
export const updateProfileImageCoverCloud = asyncHandler(async(req,res,next)=>{
  let images = []
  for (const file of req.file) {
    const {secure_url , public_id} = await cloud.uploader.upload(file.path, {folder:`${process.env.APP_Name}/user/${process.env.APP_Name}/profile/cover`})
    images.push({secure_url , public_id})
  }
  const user = await dbServices.findOneAndUpdate({
    model: User,
    filter: { _id: req.user._id },
    data: {coverImage:images} ,
    options:{new:true} 
  });
  return successResponse({ res,data:{user} });
})