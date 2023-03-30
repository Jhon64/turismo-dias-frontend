<style lang="scss">
.file-component {
   background: rgba(0, 0, 0, 0.04);
   border: 1px solid rgba(239, 236, 237, 0.6);
   border-radius: 5px;
   position: relative;

   &:hover {
      cursor: pointer;
      // box-shadow: 1px 1px rgba(239, 236, 237, 0.3);

   }
}

.icon-upload {
   cursor: pointer;
   padding: .6rem;
   border-radius: 5px;

   &:hover {
      background: rgba(175, 174, 174, .3);
   }
}

.icon-cancel {
   cursor: pointer !important;
   padding: .4rem .5rem;
   border-radius: 50%;
   font-weight: 700;
   position: absolute;
   font-size: .8rem;
   top: 0;
   right: 0;

   &:hover {
      cursor: pointer;
      color: white;
      background: rgba(175, 174, 174, .6);
   }
}

.img-file-preview {
   width: 3rem;
   height: 3rem;
   text-align: center;
   // border-radius: 10px;
   // left: 0;
   position: relative;
   z-index: 10;
   background: rgb(255, 255, 255, .1);
   padding: 10px;
   border-radius: 5px;
   border: 1px solid rgba(0, 0, 0, 0.1);

   &:hover {
      cursor: pointer;
      color: white;
      background: rgba(175, 174, 174, .1);
   }
}
</style>
<template>
   <div :class="props.label ? 'form-group' : ''">
      <label v-if="props.label" class="form-label mb-0 text-muted">{{ props.label }}</label>
      <div class="w-100 file-component flex items-center flex-column justify-center py-2 px-2">
         <div class="icon-upload fa fa-upload " v-if="!_state.files" @click="$event => { _inputFile.click() }"
            style="font-size: 1.5rem;"></div>
         <div class="icon-cancel fa fa-times " v-if="_state.files"
            @click="$event => { _state.files = null; _inputFile.value = null }"></div>
         <img class="img-file-preview" v-if="_state.files" :src="(_state.urlIconPrev)" />
         <label class='block mb-0 text-muted' v-if="!_state.files">Seleccione archivos</label>
         <div v-if="!props.multiple && _state.files">
            <label class='block mb-0 text-muted'>{{ _state.files?.name || 'Error al cargar archivo' }} </label>
         </div>
      </div>
   </div>
   <input class="d-none" type="file" ref="_inputFile" :multiple="props.multiple"
      @change="$event => _fnOnChangeHandle($event)">
</template>

<script  setup lang="ts">
import { reactive, ref } from 'vue';
const _state = reactive({ files: null as any, urlIconPrev: "/assets/img/img.svg" })
const _inputFile = ref<any>(null)
const props = defineProps<{
   label?: string
   class?: string
   icon?: string
   single?: boolean
   multiple?: boolean
}>()

//todo:EMITS
const fileEmit = defineEmits<{ (e: "getFile", files: File | FileList|null): void }>();

//todo: FUNCIONES 
const _fnValidarPrevImg = (filename: string) => {
   const data = filename.split(".");
   const extension = data[data.length - 1];

   const lower = extension.toLowerCase();
   if (lower == "jpg" || lower == "jpeg" || lower == "png") {
      _state.urlIconPrev = "/assets/img/img.svg"
   } else if (lower == "doc" || lower == "docx") {
      _state.urlIconPrev = "/assets/img/docx.svg"
   } else if (lower == "xls" || lower == "xlsx") {
      _state.urlIconPrev = "/assets/img/xlsx.svg"
   } else if (lower == "pdf") {
      _state.urlIconPrev = "/assets/img/pdf.svg"
   }
}

const _fnOnChangeHandle = (event: any) => {
   const files = event.target.files
   if (!props.multiple) {//*solo cargamos un archivo
      const singleFile = files[0]
      if (singleFile) {
         _state.files = singleFile
         _fnValidarPrevImg(_state.files?.name)
      } else {
         _state.files = null; _inputFile.value = null
      }

   }
   fileEmit('getFile',_state.files)
}

</script>