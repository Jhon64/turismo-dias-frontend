<script lang="ts" setup>
// import type { BreadcrumbItem } from "@types/breadcrumb";
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import DataTable from "@components/DataTable/DataTable.vue";
import ModalComponent from "@components/Modal.vue";

import "chartjs-adapter-moment";
import { TOASTR } from "@/helpers/Alerts/Toastr";
import "./HomeView.scss";

import type { TipoOperaciones } from "@/common/@types/TipoOperaciones";
import SelectCustom from "@/components/selects/SelectCustom.vue";
import type { DatatableType } from "@/common/@types/datatable";
// import { Chart, type ChartConfiguration, type ChartItem } from "chart.js";
// import { DoughnutChart, useDoughnutChart } from "vue-chart-3";
// import { Chart, ChartData, ChartOptions, registerables } from "chart.js";

/** INTERFACES */

// ESTADOS

const DataChart: any = ref(null);
const DataChart2: any = ref(null);
const ConfigChart: any = ref(null);
const ConfigChart2: any = ref(null);
const ChartVariable: any = ref(null);
const ChartVariable2: any = ref(null);
const Data = ref([]);

const DataLabelsPrincipal: any = ref([]);
const DataSetsPrincipal: any = ref([]);

const DataLabelsSecundario: any = ref([]);
const DataSetsSecundario: any = ref([]);

const SelectMonthOrAnio: any = ref(true);
const ListaClientes = ref<any>([]);
const Tabla = ref<DatatableType>({
  header: [
    { _key: "nombre", label: "Proyecto" },
    { _key: "responsable", label: "Responsable" },
    { _key: "estado_proyecto", label: "Estado" },
    // { _key: "tarifaHora", label: "Tarifa Hora" },
    { _key: "totalHoras", label: "Total Horas" },

    // { _key: "status_debt", label: "Estado" },

    // { _key: "limit_date", label: "Fecha de Pago" },
    // { _key: "subtotal_formateada", label: "subtotal" },

    // { _key: "payment_total_amount", label: "Deuda Total" },
    // { _key: "pending_amount_debt", label: "Deuda Pendiente" },
    // { _key: "payment_amount_debt", label: "Monto Pagado" },

    // { _key: "id", label: "Operaciones" },
  ],
  data: [],
});

const ActiveModal = ref<Boolean>(false);

const filter: any = ref({
  month_date: null,
  initDate: null,
  finDate: null,
  year: null,
});

const MonthAll: any = ref([
  { id: 0, name: "ENERO", initDate: "01-01-" },
  { id: 1, name: "FEBRERO", initDate: "02-01-" },
  { id: 2, name: "MARZO", initDate: "03-01-" },
  { id: 3, name: "ABRIL", initDate: "04-01-" },
  { id: 4, name: "MAYO", initDate: "05-01-" },
  { id: 5, name: "JUNIO", initDate: "06-01-" },
  { id: 6, name: "JULIO", initDate: "07-01-" },
  { id: 7, name: "AGOSTO", initDate: "08-01-" },
  { id: 8, name: "SEPTIEMBRE", initDate: "01-01-" },
  { id: 9, name: "OCTUBRE", initDate: "10-01-" },
  { id: 10, name: "NOVIEMBRE", initDate: "11-01-" },
  { id: 11, name: "DICIEMBRE", initDate: "12-01-" },
]);
const YearAll: any = ref([
  { id: 0, name: "2017", initDate: "01-01-", finDate: "12-31-" },
  { id: 1, name: "2018", initDate: "01-01-", finDate: "12-31-" },
  { id: 2, name: "2019", initDate: "01-01-", finDate: "12-31-" },
  { id: 3, name: "2021", initDate: "01-01-", finDate: "12-31-" },
  { id: 4, name: "2022", initDate: "01-01-", finDate: "12-31-" },
  { id: 5, name: "2023", initDate: "01-01-", finDate: "12-31-" },
]);
const selectMonth: any = ref(null);
const selectYear: any = ref(null);

// ? data for modal
const DataSelectForModal: any = ref(null);

const BreadcrumbList = ref([
  { name: "Home", icon: "fa fa-home", url: "/dashboard" },
  { name: "Dashboard", icon: "fa fa-edit" },
]);
// const dataLabels = ref(["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"]);
const labels = ["January", "February", "March", "April", "May", "June"];

const data = {
  labels: labels,
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgb(255, 99, 132)",
      data: [0, 10, 5, 2, 20, 30, 45],
    },
    {
      label: "My Second dataset",
      backgroundColor: "rgb(20, 50, 90)",
      borderColor: "rgb(20, 50, 90)",
      data: [10, 25, 15, 20, 40, 50, 40],
    },
    {
      label: "My Third dataset",
      backgroundColor: "rgb(90, 50, 20)",
      borderColor: "rgb(90, 50, 20)",
      data: [40, 37, 45, 30, 20, 15, 10],
    },
  ],
};

const config: ChartConfiguration = {
  type: "line",
  data: data,
  options: {
    responsive: true,
  },
};

const data1 = {
  labels: ["Red", "Orange"],
  datasets: [
    {
      label: "Dataset 1",
      data: [40, 37],
      backgroundColor: ["rgb(255, 0, 0)", "rgb(210, 178, 0)"],
    },
  ],
};

const config1: ChartConfiguration = {
  type: "pie",
  data: data1,
  options: {
    responsive: false,
    plugins: {
      legend: {
        position: "top",
      },
      // title: {
      //   display: true,
      //   text: ''
      // }
    },
  },
};

/**VALIDATE PARA VALIDACION DE FORMULARIOS */

/**FIN DE VALIACION */

/** MOUNTED ** CUANDO EL COMPONENTE SE RENDERIZA EN EL DOM  */
onMounted(() => {
  // _fnInitCanvas();
  const month = new Date().getMonth();
  selectMonth.value = MonthAll.value[month];
  selectYear.value = YearAll.value[4];

});
/* METODOS*/

</script>
<template>
  <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

  <q-card>
    <q-card-section>
      <div class="card-title flex align-items-center">
        <h6 class="flex-grow-1">
          <span class="fas fa-file-archive"></span> Dashboard
        </h6>
      </div>
      <hr />
      <div style="display: flex; width: 100%; flex-direction: column">
        <div class="div-chart01">
          <div style="display: flex; width: 100%">
            <div class="div-filtre">
              <label for="" style="font-size: 11px !important">Cliente</label>
              <SelectCustom
                :data="ListaClientes"
                :itemName="'razonSocial'"
                :placeholder="'Cliente'"
                @selectedItem="_fnSelectedCustomItemCliente"
              />
            </div>
            <div v-if="SelectMonthOrAnio" style="align-self: end">
              <div style="display: flex">
                <label
                  for=""
                  class="btn-select-month"
                  @click="_fnChangeMonth('less')"
                  >{{ "<" }}</label
                >
                <label for="" class="btn-label-month">{{
                  selectMonth ? selectMonth.name : ""
                }}</label>
                <label
                  for=""
                  class="btn-select-month"
                  @click="_fnChangeMonth('')"
                  >{{ ">" }}</label
                >

                <div style="margin-left: 30px">
                  <div class="dropdown">
                    <label for="" class="label-anio">{{
                      selectYear ? selectYear.name : ""
                    }}</label>
                    <a
                      href="#"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <q-icon
                        name="expand_more"
                        class="btn-expand-more"
                      ></q-icon>
                    </a>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li v-for="(row, index) in YearAll" :key="index">
                        <a
                          class="dropdown-item"
                          style="cursor: pointer"
                          @click="handleChangeAnioForMonth(row)"
                          >{{ row.name }}</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!SelectMonthOrAnio" style="align-self: end">
              <label
                for=""
                class="btn-select-month"
                @click="_fnChangeYear('less')"
                >{{ "<" }}</label
              >
              <label for="" class="btn-label-month">{{
                selectYear ? selectYear.name : ""
              }}</label>
              <label
                for=""
                class="btn-select-month"
                @click="_fnChangeYear('')"
                >{{ ">" }}</label
              >
            </div>

            <div style="position: absolute; right: 2%">
              <div class="dropdown">
                <a
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <q-icon name="filter_alt" style="color: gray"></q-icon>
                </a>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <li>
                    <a
                      class="dropdown-item"
                      style="cursor: pointer"
                      @click="changeMesOrAnio('month')"
                      >Mes</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      style="cursor: pointer"
                      @click="changeMesOrAnio('year')"
                      >Año</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            style="
              width: 100%;
              display: flex;
              height: 30rem;
              justify-content: center;
            "
          >
            <canvas id="myChart" style="cursor: pointer"></canvas>
          </div>
        </div>
        <div class="div-chart02">
          <div style="width: 100%; height: 5.8%"></div>
          <div
            style="
              display: flex;
              width: 100%;
              padding-right: 10px;
              height: 30rem;
              justify-content: center;
            "
          >
            <canvas id="myChart2" style="cursor: pointer"></canvas>
          </div>
        </div>
      </div>
      <!-- <div >
        <div class="div-chart02">
          <div style="width: 100%; height: 5.8%"></div>
          <div style="width: 100%; padding-right: 10px">
            <canvas id="myChart2" style="cursor: pointer"></canvas>
          </div>
        </div>
      </div> -->
    </q-card-section>
  </q-card>

  <ModalComponent :active="ActiveModal" size="lg" :show-footer="false">
    <template #header>
      <div class="modal-header py-3">
        <h6 class="modal-title"><span></span> Detalle Cliente</h6>
      </div>
    </template>
    <div>
      <div style="display: flex">
        <div style="width: 70%">
          <label for="">Razon Social:</label>
          <label for="" style="margin-left: 5px">{{
            DataSelectForModal ? DataSelectForModal.razonSocial : ""
          }}</label>
        </div>
        <div style="width: 30%">
          <label for="">Ruc:</label>
          <label for="" style="margin-left: 5px">{{
            DataSelectForModal ? DataSelectForModal.ruc : ""
          }}</label>
        </div>
      </div>

      <div style="display: flex">
        <div style="width: 70%">
          <label for="">Telefono:</label>
          <label for="" style="margin-left: 5px">{{
            DataSelectForModal ? DataSelectForModal.telefono : ""
          }}</label>
        </div>
        <div style="width: 30%">
          <label for="">Tarifa Hora:</label>
          <label for="" style="margin-left: 5px">{{
            DataSelectForModal ? DataSelectForModal.tarifaHora : ""
          }}</label>
        </div>
      </div>

      <div style="display: flex; width: 100%">
        <data-table :data="Tabla.data" :header="Tabla.header" :filter="false">
          <template #body_estado_proyecto="{ value, row }">
            <div>
              <template v-if="row.estado_proyecto == 1">
                <label for="" class="registrado">Registrado</label>
              </template>
              <template v-if="row.estado_proyecto == 2">
                <div style="width: 153px">
                  <div>
                    <label for="" class="en-curso">En Curso </label>
                  </div>
                  <label for="" class="info">Sin OC y Confirmado</label>
                </div>
              </template>
              <template v-if="row.estado_proyecto == 3">
                <label for="" class="en-curso">En Curso</label>
              </template>
              <template v-if="row.estado_proyecto == 4">
                <div style="width: 153px">
                  <div>
                    <label for="" class="cerrado">Cerrado </label>
                  </div>
                  <label for="" class="info">Sin OC y No Confirmado</label>
                </div>
              </template>
              <template v-if="row.estado_proyecto == 5">
                <div style="width: 153px">
                  <div>
                    <label for="" class="cerrado">Cerrado </label>
                  </div>
                  <label for="" class="info">Con OC y No Confirmado</label>
                </div>
              </template>
              <template v-if="row.estado_proyecto == 6">
                <label for="" class="cerrado">Cerrado</label>
              </template>
              <template v-if="row.estado_proyecto == 7">
                <label for="" class="cancelado">Cancelado</label>
              </template>
            </div>
          </template>
          <template #body_id="{ value, row }"> {{ "" }}</template>
        </data-table>
      </div>

      <!-- <div style="display: flex"></div> -->
    </div>
    <div style="width: 100%">
      <div class="mt-3 text-center">
        <button
          class="btn btn-sm btn-outline-secondary"
          @click="_fnCloseModal('detail')"
        >
          <span class="fa fa-times"></span>&nbsp;Cancelar
        </button>
      </div>
    </div>
  </ModalComponent>
</template>
