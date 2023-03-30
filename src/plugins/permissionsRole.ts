import { StorageHelper } from "@/helpers/LocalStorage/storage.helper";

export const permissionRole = (value: string)=> {
  const infoUsuario = StorageHelper.obtenerAuthStorage();
  const permission = infoUsuario?.permission;

  if(permission == null || permission == undefined || permission.length == 0){
    return false
  }

  if(permission){
    if (permission.find((p: any) => p == (value)))
    return true 
  }

  
  return false
}