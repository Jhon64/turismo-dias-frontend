<template>
  <div class="col-sm-12">
    <div id="datatable-responsive_filter" class="dataTables_filter flex">
      <label
        >Search:&nbsp;
        <input
          type="search"
          class="form-control input-sm form-control-sm"
          placeholder="Filtrar"
          v-model="search"
          @keyup="handleSearch"
          aria-controls="datatable-responsive"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const search = ref<string>("");
const emits = defineEmits<{ (e: "getInputSearch", search: string): void }>();

function handleSearch({ target }) {
  const { value } = target;
  emits("getInputSearch", value);
}
</script>

<style scoped></style>
