<template>
  <div id="nav-header">
    <header class="header-theme">
      <div class="nav-logo">
        <div class="nav_title" style="border: 0">
          <a routerLink="/" class="site_title">
            <!--            <i class="fas fa-chart-line"></i>-->
            <!--            &nbsp;&nbsp;<span>Trazabilidad</span>-->
            <img
              src="@/assets/img/Logo-negativo.png"
              class="img-circle profile_img"
              style="height: 50px; width: 110px; text-align: center"
            />
          </a>
        </div>
      </div>
      <div class="menu-right">
        <div
          id="toggle-menu"
          @click="testClickMenuIcon()"
          class="navbar nav icon-menu"
        >
          <a><span class="fa fa-bars"></span></a>
        </div>
        <div id="nav-options-menu" class="nav-right">
          <ul class="nav navbar-right">
            <li
              class="navbar nav-item dropdown nav-header-option user-option open"
              style="padding-left: 15px"
            >
              <a
                href="javascript:;"
                class="user-profile dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img src="@/assets/img/default.png" />{{ userName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="#"
                    ><span class="fa fa-user-alt"></span>&nbsp;&nbsp;Perfil</a
                  >
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/logout"
                    ><span class="fa fa-sign-out"></span> Cerrar
                    Sesion</RouterLink
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { StorageHelper } from "@/helpers/LocalStorage/storage.helper";
export default {
  name: "header02Layout",
  data() {
    return{userName:''}
  },
  mounted() {
    const infoUsuario = StorageHelper.obtenerAuthStorage()
    this.userName = infoUsuario?.userName || ''
  },
  methods: {
    testClickMenuIcon() {
      let sidebar = document.querySelector("#container-body");
      if (sidebar?.classList.contains("active-sidebar-menu")) {
        sidebar.classList.remove("active-sidebar-menu");
        sidebar.classList.add("container-body");
      } else {
        sidebar?.classList.add("active-sidebar-menu");
        sidebar?.classList.remove("container-body");
      }
    },
  },
};
</script>

<style scoped></style>
