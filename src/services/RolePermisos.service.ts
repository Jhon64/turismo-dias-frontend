import { RolePermisosRoute } from "./ApiRoutes";
import { AxiosService } from "@/services/Axios.service";
import  type {ConfirmacionEnum} from "@/common/@types/Operacion.crud";



export const RolePermisosService = {
  fnGetListar: async () => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(RolePermisosRoute + "/listar");
  },
  fnPostRegistrar: async (form: any) => {
    return await AxiosService.POST(RolePermisosRoute + "/registrar", form);
  },
  fnEliminarOrActivar: async (id: number, operacion: ConfirmacionEnum) => {
    return await AxiosService.DELETE(
      RolePermisosRoute + `/eliminar/${id}?operacion=${operacion}`
    );
  },
  fnPostEditar: async (form: any) => {
    return await AxiosService.POST(RolePermisosRoute + "/registrar", form);
  },
};
