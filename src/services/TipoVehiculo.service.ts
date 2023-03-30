import { AxiosService } from "@/services/Axios.service";
import { TipoVehiculoRoute } from "@/services/ApiRoutes";


export const TipoVehiculoService = {
  fnGetListar: async () => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(TipoVehiculoRoute + "",{});
  },
  fnPostRegistrar: async (form: any) => {
    return await AxiosService.POST(TipoVehiculoRoute + "/register", form);
  },

};
