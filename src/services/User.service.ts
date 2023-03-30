import { UserRoute } from "./ApiRoutes";
import { AxiosService } from "@/services/Axios.service";
import  type {ConfirmacionEnum} from "@/common/@types/Operacion.crud";



export const UserService = {
  fnGetListar: async () => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(UserRoute);
  },
  fnPostRegistrar: async (form: any) => {
    return await AxiosService.POST(UserRoute, form);
  },
  fnEliminarOrActivar: async (id: number, operacion: ConfirmacionEnum) => {
    return await AxiosService.DELETE(
      UserRoute + `/eliminar/${id}?operacion=${operacion}`
    );
  },
  fnPostEditar: async (form: any) => {
    return await AxiosService.POST(UserRoute + "/registrar", form);
  },
};
