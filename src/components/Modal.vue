<template>
  <div
      ref="modal"
      class="modal"
      :class="{ show: isActive, 'd-block': isActive }"
      tabindex="-1"
      role="dialog">
    <div class="modal-dialog" :class="size!=undefined?'modal-'+size:''" role="document">
      <div class="modal-content">
        <slot name="header" v-if="showHeader">
          <div class="modal-header">
            <h6 class="modal-title">Titulo Modal</h6>
          </div>
        </slot>
        <div class="modal-body">
          <slot></slot>
        </div>
        <slot name="footer" v-if="showFooter">
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal" @click="cerrarModal()">Close
            </button>
            <button type="button" class="btn btn-primary btn-sm" @click="registrarModal">Save changes</button>
          </div>
        </slot>
      </div>
    </div>
  </div>
  <div v-if="isActive" class="modal-backdrop fade show"></div>

</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
export type SizeType='sm'|'md'|'lg'|'xl'
export default defineComponent({
  name: 'ModalComponent',
  setup() {
    const isActive = ref(false)
    onMounted(() => {
      console.log(this)
    })
    return {
      isActive
    }
  },
  emits: {
    estadoRegistrar: () => true,
    estadoCerrar: () => true,
  },
  props: {
    active: {type: Boolean, required: true},
    showHeader: {type: Boolean, default: true},
    showFooter: {type: Boolean, default: true},
    size: {type: String, default: '',required:false}
  },
  methods: {
    cerrarModal() {
      this.$emit('estadoCerrar')
      this.isActive = false
    },
    registrarModal() {
      this.$emit('estadoRegistrar')
      this.isActive = false
    }
  },
  watch: {
    active(newData, oldData) {
      this.isActive = newData
    }
  }
})
</script>

<style scoped>

</style>