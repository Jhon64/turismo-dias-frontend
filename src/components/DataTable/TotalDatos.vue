<template>
  <div class="col-sm-4" style="text-align: end">
    <div
      class="dataTables_info"
      id="datatable-responsive_info"
      role="status"
      aria-live="polite"
    >
      Mostrando
      {{ InitData }} a
      {{ FinData }}
      de
      {{ props.totalData }} registros
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface TotalDatosProps {
  itemsPerPage: number;
  totalData: number;
  currentPage: number;
}

const props = defineProps<TotalDatosProps>();

const InitData = computed(() => {
  return (props.currentPage - 1) * props.itemsPerPage === 0
    ? 1
    : (props.currentPage - 1) * props.itemsPerPage;
});
const FinData = computed(() => {
  if (props.totalData < props.currentPage * props.itemsPerPage) {
    return props.totalData;
  } else {
    return props.currentPage * props.itemsPerPage <= props.itemsPerPage
      ? props.currentPage * props.itemsPerPage
      : props.currentPage * props.itemsPerPage +
          (props.totalData - props.currentPage * props.itemsPerPage);
  }
});
</script>

<style scoped></style>
