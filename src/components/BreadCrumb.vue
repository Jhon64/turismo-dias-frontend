<template>
<!--  <div class="w-100 mb-3 breadcrumb">-->
<!--    <el-breadcrumb separator=">">-->
<!--      <el-breadcrumb-item v-for="(item,index) in breadcrumb" :to=" item.url||undefined " :key="index">-->
<!--        <span v-if="item.icon!==undefined"-->
<!--              :class="item.icon"></span>-->
<!--        {{ item.name }}-->
<!--      </el-breadcrumb-item>-->
<!--    </el-breadcrumb>-->
<!--  </div>-->
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs class="text-brown">
      <template v-slot:separator>
        <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
        />
      </template>
      <q-breadcrumbs-el v-for="(item,index) in breadcrumb" :to="item.url||undefined" size="sm" :icon=" item.icon||undefined " :label="item.name||undefined" :key="index"/>-->
        <!--        <span v-if="item.icon!==undefined"-->
        <!--              :class="item.icon"></span>-->
        <!--        {{ item.name }}-->
        <!--      </el-breadcrumb-item>-->
    </q-breadcrumbs>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {BreadcrumbItem} from "@types/breadcrumb";

export default defineComponent({
  name: "BreadCrumb",
  props: {
    breadcrumb: {type: Array < BreadcrumbItem >, required: true}
  },
  data() {
    return {}
  },
  mounted() {

  },

})
</script>

<style scoped>

</style>