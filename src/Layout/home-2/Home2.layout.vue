<template>
  <div id="theme-jhon" class="template-xs">
    <div class="container-body" id="container-body" style="height: 100vh">
      <header02-layout></header02-layout>
      <div id="main-layout">
        <section id="sectionSidebar">
          <!-- sidebar menu -->
          <sidebar02-layout></sidebar02-layout>
          <!-- /sidebar menu -->
        </section>
        <section id="sectionContent">
          <div class="container-fluid mt-3">
            <RouterView />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script >
import Header02Layout from "@/Layout/home-2/header02Layout.vue";
import Sidebar02Layout from "@/Layout/home-2/Sidebar02Layout.vue";
import BreadCrumb from "@components/BreadCrumb.vue";
import { StorageHelper } from "@/helpers/LocalStorage/storage.helper";

export default {
  name: "Home2Layout",
  components: { BreadCrumb, Sidebar02Layout, Header02Layout },
  created() {
    const storage = StorageHelper.obtenerAuthStorage();
    // if (!storage?.userName && !storage?.userLogin) {
    //   this.$router.push("/login");
    // }
  },
};
</script>

<style scoped></style>
