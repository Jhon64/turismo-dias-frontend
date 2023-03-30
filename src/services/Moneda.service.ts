import { AxiosService } from "@/services/Axios.service";
import { MonedaRoute } from "@/services/ApiRoutes";
import type { ConfirmacionEnum } from "@/common/Operacion.crud";

export const MonedaService = {
  fnGetListar: async () => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(MonedaRoute);
  },
  fnPostRegistrar: async (form: any) => {
    return await AxiosService.POST(MonedaRoute, form);
  },
  fnEliminarOrActivar: async (id: number, operacion: ConfirmacionEnum) => {
    return await AxiosService.DELETE(
      MonedaRoute + `/${id}?operacion=${operacion}`
    );
  },
  fnPostEditar: async (form: any) => {
    return await AxiosService.POST(MonedaRoute, form);
  },
};
