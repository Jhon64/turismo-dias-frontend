<template>
  <div class="card-box" style="width: 100%">
    <div
        id="datatable-responsive_wrapper"
        class="dataTables_wrapper container-fluid dt-bootstrap no-footer"
    >
      <div class="flex justify-between">
        <NroRegistros
            :itemsPerPage="itemsPerPage"
            @getItems="obtenerItemsPorPagina"
        />
        <Filtrar @getInputSearch="fnGetInputSearch" v-if="props.filter"/>
      </div>
      <div
          class="table-responsive mt-2"
          style="min-height: 13rem; max-height: 25rem; overflow-y: auto"
      >
        <table
            id="datatable-responsive"
            :class="
            props.classTipoTabla
              ? props.classTipoTabla
              : 'table table-striped table-bordered'
          "
            class="nowrap dataTable no-footer dtr-inline"
            cellspacing="0"
            width="100%"
            role="grid"
            aria-describedby="datatable-responsive_info"
            style="width: 100%"
        >
          <thead>
          <tr role="row">
            <th
                class="sorting_asc"
                tabindex="0"
                aria-controls="datatable-responsive"
                rowspan="1"
                colspan="1"
                v-for="(item, index) in props.header"
                :key="index"
            >
              <slot
                  :name="`header_${item._key}`"
                  :value="item._key"
                  :item="item"
              >
                {{ item.label || item._key }}
              </slot>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-if="loading">
            <td :colspan="props.header.length" class="text-center">
              <span class="fas fa-spin-pulse fa-spinner"></span> Loading ...
            </td>
          </tr>
          <tr
              v-else-if="ParsearData.length > 0"
              role="row"
              v-for="(Row, index) in ParsearData"
              :key="index"
              class="odd"
          >
            <td
                tabindex="0"
                class="sorting_1"
                v-for="cell in Row.list"
                :key="cell._key"
            >
              <slot
                  :name="`body_${cell._key}` || undefined"
                  :value="cell.value"
                  :row="Row.row"
              >{{ cell.value }}
              </slot>
            </td>
          </tr>
          <tr v-else>
            <td :colspan="props.header.length" class="text-center">
              No Hay Informaci&oacute;n ...
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="flex justify-between" style="margin-top: 20px">
        <TotalDatos
            :totalData="props.data.length"
            :itemsPerPage="itemsPerPage"
            :current-page="currentPage"
        />
        <Paginacion
            @obtenerPagina="obtenerPaginaActual"
            :items-per-page="itemsPerPage"
            :total-data="data.length"
            :totalPaginas="TotalPaginas"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch,} from "vue";
import type {HeaderDataTable} from "@/common/IDataTable";
import NroRegistros from "@/components/DataTable/NroRegistros.vue";
import Filtrar from "@/components/DataTable/Filtrar.vue";
import TotalDatos from "@/components/DataTable/TotalDatos.vue";
import Paginacion from "@/components/DataTable/Paginacion.vue";

export interface PropsDatatable {
  data: { type: Array<any>; required: true; default: [] };
  header: { type: HeaderDataTable; required: true; default: [] };
  loading?: boolean;
  filter: boolean;
  classTipoTabla?: { type: string | undefined; default: "" };
}

export interface DatatablePaginas {
  value: number;
  isActive: boolean;
}

const props = defineProps<PropsDatatable>();
const itemsPerPage = ref(50);
let currentPage = ref(1);
let inputSearch = ref("");
let TotalPaginas = ref(1);

const ParsearData = computed(() => {
  const {data, header} = props;
  const initList = (currentPage.value - 1) * itemsPerPage.value;
  const finList = initList + itemsPerPage.value;
  // si se activa el search entonces se pagina en base a la informacion

  let NuevaLista = [];
  if (inputSearch.value.trim().length > 0) {
    NuevaLista = ListFiltrado();
  } else {
    NuevaLista = data.slice(initList, finList);
  }

  let newData = [];
  if (data != undefined) {
    for (const row_data of NuevaLista) {
      const NuevaFilaDatatable = [];
      for (const item_header of header) {
        if (row_data[item_header._key] !== undefined) {
          const setValue = {
            value: row_data[item_header._key],
            _key: item_header._key,
          };
          NuevaFilaDatatable.push(setValue);
        }
      }
      newData.push({list: NuevaFilaDatatable, row: row_data});
    }
  }
  fnTotalPaginas(); // calculamos las paginas
  return newData;
});
watch(props, (old, newd) => {
  fnTotalPaginas();
});

function fnTotalPaginas() {
  TotalPaginas.value = 1;
  const {data} = props;
  if (data != undefined) {
    const TamanioData = data.length;
    const datosPorPagina = itemsPerPage._value;
    const paginas = Math.ceil(TamanioData / datosPorPagina);
    TotalPaginas.value = inputSearch.value.trim().length > 0 ? 1 : paginas;
  }
}

function obtenerPaginaActual(page: any) {
  currentPage.value = page;
}

function fnGetInputSearch(search: string) {
  inputSearch.value = search;
}

function ListFiltrado() {
  const {data, header} = props;
  if (inputSearch.value.trim().length > 0) {
    const filtrado = data.filter((x) => {
      const headerFilter = header.find((head) => {
        if (
            (x[head._key] + "")
                .toLowerCase()
                .indexOf(inputSearch.value.toLowerCase()) !== -1
        ) {
          return head;
        }
      });
      if (headerFilter != undefined) return x;
    });
    return filtrado;
  } else {
    return data;
  }
}

function obtenerItemsPorPagina(items: number) {
  currentPage.value = 1;
  itemsPerPage.value = Number.parseInt(items + "");
  fnTotalPaginas();
}
</script>

<style scoped></style>
