import { AxiosService } from "@/services/Axios.service";
import { CombustibleRoute } from "@/services/ApiRoutes";

export const CombustibleService = {
   fnGetListar: async () => {
     // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
     return await AxiosService.GET(CombustibleRoute + "",{});
   },
   fnPostRegistrar: async (form: any) => {
     console.log('register  ::',form)
     return await AxiosService.POST(CombustibleRoute + "/register", form);
   },
 
 };
 