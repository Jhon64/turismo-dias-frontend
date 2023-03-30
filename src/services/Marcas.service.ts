import { AxiosService } from "@/services/Axios.service";
import { MarcaRoute } from "@/services/ApiRoutes";


export const MarcaService = {
  fnGetListar: async () => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    return await AxiosService.GET(MarcaRoute + "",{});
  },
  fnPostRegistrar: async (form: any) => {
    console.log('register marca ::',form)
    return await AxiosService.POST(MarcaRoute + "/register", form);
  },

};
