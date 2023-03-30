import {AxiosService} from "@/services/Axios.service";
import { UsuarioRoute, LoginRoute } from "@/services/ApiRoutes";

export const LoginService = {
  auth: async (usuarioForm: any) => {
    return await AxiosService.POST(LoginRoute, usuarioForm);
  },
  validarPassword: async (usuarioForm: any) => {
    return await AxiosService.POST(
      UsuarioRoute + "/login",
      usuarioForm
    );
  },
};