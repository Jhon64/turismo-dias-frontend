import { MenuRoute } from "./ApiRoutes";
import { AxiosService } from "@/services/Axios.service";
import  type {ConfirmacionEnum} from "@/common/@types/Operacion.crud";



export const MenuService = {
  fnGetListar: async (filter: any = {}) => {
    let params = { ...filter }
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(MenuRoute + "/listar", params);
  },
  fnPostRegistrar: async (form: any) => {
    return await AxiosService.POST(MenuRoute + "/registrar", form);
  },
  fnEliminarOrActivar: async (id: number, operacion: ConfirmacionEnum) => {
    return await AxiosService.DELETE(
      MenuRoute + `/eliminar/${id}?operacion=${operacion}`
    );
  },
  fnPostEditar: async (form: any) => {
    return await AxiosService.POST(MenuRoute + "/registrar", form);
  },
};
