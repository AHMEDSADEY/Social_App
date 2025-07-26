import multer from "multer";

export const fileValidation = {
  image:['image/jpeg','image/png','image/gif','image/jpg'],
  document:['application/pdf','application/msword','application/docx']
}
export const uploadCloudFile = (fileValidation=[])=>{
  const storage = multer.diskStorage({})
  function fileFilter(req,file,cb){
    if(fileValidation.includes(file.mimetype)){
      cb(null , true  )
    }else{
      cb("In-valid File Format",false)  
    }
  }
  return multer({dest:'tempPath',fileFilter,storage})
}