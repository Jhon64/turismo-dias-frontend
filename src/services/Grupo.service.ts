import { AxiosService } from "@/services/Axios.service";
import { GruposRoute } from "@/services/ApiRoutes";

export const GrupoService = {
   fnGetListar: async () => {
     // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
     return await AxiosService.GET(GruposRoute + "",{});
   },
   fnPostRegistrar: async (form: any) => {
     console.log('register  ::',form)
     return await AxiosService.POST(GruposRoute + "/register", form);
   },
 
 };
 