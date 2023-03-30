import { AxiosService } from "@/services/Axios.service";
import { ModelosRoute } from "@/services/ApiRoutes";


export const ModelosService = {
  fnGetListar: async () => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(ModelosRoute + "",{});
  },
  fnPostRegistrar: async (form: any) => {
    return await AxiosService.POST(ModelosRoute + "/register", form);
  },

};
