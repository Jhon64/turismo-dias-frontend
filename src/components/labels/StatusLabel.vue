<template>
  <span class="badge "
        :class="LabelStatus">
    {{ TextoEstado }}
  </span>
</template>

<script lang="ts" setup>
import {computed} from "vue";

interface PropLabel {
  status: boolean | string
}

//propiedades
const props = defineProps<PropLabel>()

const LabelStatus = computed(() => {
  return props.status || (props.status + '').trim().toLowerCase() === 'true' ? 'bg-success' : 'bg-danger'
})
const TextoEstado = computed(() => {
  return props.status || (props.status + '').trim().toLowerCase() === 'true' ? 'Activado' : 'Desactivado'
})


</script>

<style scoped>

</style>