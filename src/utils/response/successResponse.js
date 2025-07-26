export const successResponse = ({res,status=200,message="DONE",data = {}})=>{
  return res.status(status).json({message , data})
}
