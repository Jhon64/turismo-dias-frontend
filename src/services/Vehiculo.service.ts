
import { AxiosService } from "@/services/Axios.service";
import { VehiculosRoute } from "@/services/ApiRoutes";
export const VehiculoService = {
  fnGetListar: async (id?: number) => {
    // return await AxiosService.GET(MonedaRoute+'?isPaginate=true')
    let url = VehiculosRoute
    if (id) {
      url = url + (id ? "?id=" + id : '')
    }
    return await AxiosService.GET(url, {});
  },
  fnPostRegistrar: async (form: any) => {
    console.log('register marca ::', form)
    return await AxiosService.POST(VehiculosRoute + "/register", form,
      { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  async addDocumentos(form: any) {
    return await AxiosService.POST(VehiculosRoute + "/documentos", form,
      { headers: { 'Content-Type': 'multipart/form-data' } });
  }

};
