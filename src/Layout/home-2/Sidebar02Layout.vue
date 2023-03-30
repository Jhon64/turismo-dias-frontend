<link rel="stylesheet" href="../../assets/scss/theme-02.scss">
<script lang="ts">
import { defineComponent } from "vue";

import { RouterLink } from "vue-router";
import { MENU } from "@/_nav";
import { StorageHelper } from "@/helpers/LocalStorage/storage.helper";
import type { MenuDetalle } from "@/common/@types/menu.sidebar";

export default defineComponent({
  name: "Sidebar02Layout",
  data() {
    return {
      menuList: [] as MenuDetalle[],
      userName: "",
      permission: [],
    };
  },
  created() {
    const infoUsuario = StorageHelper.obtenerAuthStorage();
    this.permission = infoUsuario?.permission;
    this.userName = infoUsuario?.userName || "";
    // if (infoUsuario && this.permission) {
      this.fnCargarMenu();
    // } else {
    //   StorageHelper.limpiarStorage();
    //   window.location.href = import.meta.env.VITE_APP_ROUTE + "/login";
    // }
  },
  mounted() {},
  methods: {
    fnClickLis(event: MouseEvent) {
      // var elementClick = document.querySelectorAll('.side-menu>li');
      //console.log(elementClick);

      //cuando usamos server rendering universal, al complar objia toos las api del document
      let clickElement = event.target as HTMLElement;
      let parentNode = clickElement.parentNode;
      //verificamos si el elmento padre es el LI de la navegacion
      if (parentNode?.nodeName == "LI") {
        if (clickElement.parentElement?.classList.contains("menu")) {
          this.fnActivarMenu(clickElement.parentElement);
        }
      }
      //verificar si el elemento padre es el A en la navegacion
      if (parentNode?.nodeName == "A") {
        if (
          clickElement.parentElement?.parentElement?.classList.contains("menu")
        ) {
          this.fnActivarMenu(clickElement.parentElement?.parentElement);
        }
      }

      //console.log(liElement);
      //liElement.classList.add('active');
    },

    fnActivarMenu(eliElement: HTMLElement | null | undefined) {
      if (eliElement != undefined) {
        if (eliElement?.classList.contains("active")) {
          eliElement.classList.remove("active");
        } else {
          let sidebarOptions = document.querySelectorAll(".side-menu>li");
          sidebarOptions.forEach((sidebarItem) => {
            sidebarItem.classList.remove("active");
          });
          eliElement?.classList.add("active");
        }
      }
    },
    _fnParseDataMenu(data: any) {
      const newData: any = [];
     // if (this.permission) {
        data.map((dt: any) => {
          const submenu: any = [];
          if (dt.submenus.length > 0) {
            // evalua el sub item
            dt.submenus.map((dtm: any) => {
             // if (this.permission.find((p: any) => p.includes(dtm.slug)))
                submenu.push(dtm);
            });
            if (submenu.length > 0) newData.push({ ...dt, submenus: submenu });
          } else {
            //if (this.permission.find((p: any) => p.includes(dt.slug)))
              newData.push(dt);
          }
        });
      //}
      return newData;
    },
    fnCargarMenu() {
      const menu: MenuDetalle = this._fnParseDataMenu(MENU);
      //debugger
      this.menuList = menu;
    },
  },
});
</script>

<template>
  <!-- **********************************************************************************************************************************************************
        MAIN SIDEBAR MENU
        *********************************************************************************************************************************************************** -->
  <!--sidebar start-->
  <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
    <div class="profile clearfix">
      <div class="profile_pic">
        <img src="@assets/img/default.png" class="img-circle profile_img" />
      </div>
      <div class="profile_info">
        <span>Bienvenido,</span>
        <h2>{{ userName }}</h2>
      </div>
    </div>
    <div class="sidebar-menu_options">
      <div class="menu_section">
        <h3>General</h3>
        <ul class="nav side-menu">
          <li
            v-for="item in menuList"
            class="menu"
            @click="fnClickLis($event)"
            :key="item"
          >
            <RouterLink v-if="item.submenus.length > 0" to="">
              <i :class="item.icono"></i>
              {{ item.descripcion }}
              <span class="fas fa-chevron-down"></span>
            </RouterLink>

            <RouterLink v-else :to="item.url">
              <i :class="item.icono"></i>
              {{ item.descripcion }}
            </RouterLink>

            <ul v-show="item.submenus.length > 0" class="nav child_menu">
              <li
                v-for="_submenu in item.submenus"
                class="children"
                :key="_submenu"
              >
                <RouterLink :to="item.url + '/' + _submenu.url">
                  <span :class="_submenu.icono"></span>
                  {{ _submenu.descripcion }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
