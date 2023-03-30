<template>
  <div class="col-sm-5 float-end">
    <div
      class="dataTables_paginate paging_simple_numbers"
      id="datatable-responsive_paginate"
    >
      <ul class="pagination float-right">
        <li
          class="paginate_button previous"
          :class="DisabledPrev"
          id="datatable-responsive_previous"
        >
          <a
            class="cursor-pointer cursor-pointer-left"
            @click="PrevOrNext('Prev')"
          >
            <q-icon name="keyboard_arrow_left" style="font-size: 18px"></q-icon>
          </a>
        </li>
        <li
          class="paginate_button"
          :class="{ active: item.isActive }"
          v-for="(item, index) in ArrayPaginas"
          :key="index"
        >
          <a
            aria-controls="datatable-responsive"
            @click="currentPage(item.value)"
            tabindex="0"
            >{{ item.value }}</a
          >
        </li>
        <li
          class="paginate_button next"
          :class="DisabledNext"
          id="datatable-responsive_next"
        >
          <a
            class="cursor-pointer cursor-pointer-rigth"
            @click="PrevOrNext('Next')"
            ><q-icon
              name="keyboard_arrow_right"
              style="font-size: 18px"
            ></q-icon
          ></a>
        </li>
      </ul>
    </div>
    <!--    <el-pagination-->
    <!--        :page-size="itemsPerPage"-->
    <!--        layout=" prev, pager, next"-->
    <!--        next-text="NEXT"-->
    <!--        prev-text="PREVIOUS"-->
    <!--        :total="totalData">-->
    <!--    </el-pagination>-->
  </div>
</template>

<script lang="ts" setup>
import { computed, ref ,watch} from "vue";

const props = defineProps<{
  totalPaginas: number;
  totalData: number;
  itemsPerPage: number;
}>();
const paginaActual = ref<number>(1);
const listaPaginas=ref<[]>([])


const Emits = defineEmits<{ (e: "obtenerPagina", page: number): void }>();

const ArrayPaginas = computed(() => {
  // debugger
  const { totalPaginas } = props;
  const nroDisplay = 7;
  const initDisplay =
    paginaActual.value < nroDisplay
      ? paginaActual.value
      : paginaActual.value - 2;
  const finDisplay = paginaActual.value + 2;
  if (totalPaginas != undefined) {
    //Lista de Paginas
    const _ListPaginas = [];
    let index = initDisplay < nroDisplay ? 1 : initDisplay;
    // _ListPaginas.push({isActive: 1 === paginaActual.value, value: 1})

    for(let index=1;index<=totalPaginas;index++){
      //if (index <= nroDisplay) {
        _ListPaginas.push({
          isActive: index === paginaActual.value,
          value: index,
        });
      //}
    }

    //
    // for (let i = 1; i <= totalPaginas; i++) {
    //   _ListPaginas.push({isActive: i === paginaActual.value, value: i})
    // }

    return _ListPaginas;
  } else [];
});




const DisabledPrev = computed(() => {
  const { totalPaginas } = props;
  let className = "";
  if (totalPaginas != undefined) {
    if (totalPaginas == 1 || paginaActual.value == 1) className = "disabled";
  }
  return className;
});

const DisabledNext = computed(() => {
  const { totalPaginas } = props;
  let className = "";
  if (totalPaginas != undefined) {
    if (totalPaginas == 1 || paginaActual.value == totalPaginas)
      className = "disabled";
  }
  return className;
});

function currentPage(page: number) {
  // console.log('emitiendo pagina', page)
  paginaActual.value = page;
  Emits("obtenerPagina", page);
}

function PrevOrNext(type: "Prev" | "Next" = "Prev") {
  const { totalPaginas } = props;
  if (type == "Prev") {
    paginaActual.value =
      paginaActual.value - 1 > 0 ? paginaActual.value - 1 : 1;
  } else {
    paginaActual.value =
      paginaActual.value + 1 <= totalPaginas
        ? paginaActual.value + 1
        : totalPaginas;
  }
  console.log(paginaActual.value);
  Emits("obtenerPagina", paginaActual.value);
}
</script>

<style scoped></style>
