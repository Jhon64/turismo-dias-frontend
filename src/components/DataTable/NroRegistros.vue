<template>
  <div class="col-sm-3">
    <div class="dataTables_length" id="datatable-responsive_length">
      <label class=""
        >Mostrar&nbsp;
        <select
          name="datatable-responsive_length"
          class="form-control form-control-sm"
          aria-controls="datatable-responsive"
          v-model="itemsPerPage"
          style="color: #69abac"
          @change="handleChangeItemPerPage(itemsPerPage)"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option></select
        >&nbsp; Registros</label
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const { itemsPerPage } = defineProps<{ itemsPerPage: number }>();
const emits = defineEmits<{ (e: "getItems", items: number): void }>();

function handleChangeItemPerPage(items) {
  emits("getItems", items);
}
</script>

<style scoped></style>
