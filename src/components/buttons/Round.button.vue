<script lang="ts" setup>
export interface ButtonProps {
  icon?: string;
  fondoColor?: string;
  bgFondoColor?: string;
  textColor?: string;
  label?: string;
  title?: string;
}

const props = defineProps<ButtonProps>();
</script>
<template>
  <button
    :title="props.title"
    class="btn btn-sm button button-rounded"
    :class="'bg-' + props.bgFondoColor"
  >
    <q-icon
      :color="props.textColor"
      v-if="props.icon != undefined"
      :name="props.icon"
    ></q-icon>
    <template v-if="props.label != undefined">
      &nbsp;
      <label :class="'text-' + props.textColor">{{ props.label }}</label>
    </template>
  </button>
</template>

<style scoped>
.button-rounded {
  border-radius: 50%;
  padding: 1px 5px;
  margin: 0 1px;
}
</style>
