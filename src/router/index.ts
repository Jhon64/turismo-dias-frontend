
import { createRouter, createWebHistory } from "vue-router";

import Home2Layout from "../Layout/home-2/Home2.layout.vue";
import LoginView from "@/views/auth/LoginView.vue";
import NotFound from "@/views/NotFoundView.vue";
import HomeView from "@/views/home/HomeView.vue";
import UsuariosView from "@/views/accesos/usuarios/UsuariosView.vue"
import RolesPermisosView from "@/views/accesos/rolesPremisos/RolesPermisosView.vue"
import TipoVehiculoView from "@/views/maestros/tipo-vehiculos/TipoVehiculos.vue";
import MarcasView from "@/views/maestros/marcas/Marca.vue";
import ModelosView from "@/views/maestros/modelos/Modelos.vue";
import VehiculoView from "@/views/maestros/vehiculos/Vehiculos.vue";
import VehiculoRegisterView from "@/views/maestros/vehiculos/VehiculoRegister.vue";
import CombustibleView from "@/views/maestros/combustible/Combustible.vue";
import GrupoView from "@/views/maestros/grupo/Grupo.vue";

import LogoutView from "@/views/auth/LogoutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home2Layout,
      children:[
        { path: "dashboard", component: HomeView },

      ]
    },
    
    {
      path: "/maestros",
      name: "maestros",
      component: Home2Layout,
      children: [
        { path: "tipo-vehiculos", component: TipoVehiculoView },
        { path: "marcas", component: MarcasView },
        { path: "modelos", component: ModelosView },
        { path: "vehiculos", component: VehiculoView },
        { path: "vehiculo/register", component: VehiculoRegisterView },
        { path: "vehiculo/register/:id", component: VehiculoRegisterView },
        { path: "combustible", component: CombustibleView },
        { path: "grupo", component: GrupoView },

      ],
    },
    {
      path: "/accesos",
      name: "accesos",
      component: Home2Layout,
      children: [
        { path: "usuarios", component: UsuariosView},
        { path: "roles", component: RolesPermisosView }
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/logout",
      name: "logout",
      component: LogoutView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: Home2Layout,
      // },
      children: [
        {
          path: "",
          component: NotFound,
        },
      ],
    },
  ],
});

export default router;
