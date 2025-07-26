import { rolesType } from "../../DB/model/User.model.js";


export const endPoint = {
    createPost :[rolesType.USER],
    freazePost:[rolesType.USER , rolesType.ADMIN]
}