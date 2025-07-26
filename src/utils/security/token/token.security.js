import jwt from "jsonwebtoken"
import { User } from "../../../DB/model/User.model.js"
export const genrateToken = ({payload={},signture = process.env.USER_ACCESS_TOKEN , expireIn=process.env.EXPIREIN})=>{
  const token = jwt.sign(payload,signture,{expiresIn:parseInt(expireIn)})
  return token 
}
export const genrateVrifay = ({token,signture = process.env.USER_ACCESS_TOKEN})=>{
  const decoded = jwt.verify(token ,signture)
  return decoded 
}
  export const tokenTypes = {
  access:"access",
  refreh:"refresh"
  }
export const decoded = async({authorization= "",tokenType = tokenTypes.access , next={} }={})=>{ 
  const [bearer , token] = authorization?.split(" ") || []
  if(!bearer || !token){
    return next(new Error("Missing Token ",{cause:400}))
  }
  let access_signature = "";
  let refreh_signature = ""
  switch (bearer) {
    case "System":
      access_signature = process.env.ADMIN_ACCESS_TOKEN  
      refreh_signature = process.env.ADMIN_REFREH_TOKEN  
      break;
    case "Bearer":
      access_signature = process.env.USER_ACCESS_TOKEN
      refreh_signature = process.env.USER_REFREH_TOKEN
    default:
      break;
  }
  const decoded = genrateVrifay({token , signature:tokenType == tokenType.access ? access_signature : refreh_signature})
  if(!decoded?.id){
    return next(new Error("In-valid Payload !"))
  }
  const user = await User.findOne({_id:decoded.id ,isDeleted:false})
  if(!user) {
    return next(new Error("Not Register Account !",{cause:404}))
  }
  if(user.changeCridentialsTime?.getTime() >= decoded.iat * 1000){
    return next(new Error("In-valid Login credentials ",{cause:400}))
  }
  return user
}
