<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import type { DatatableType } from "@/common/@types/datatable";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { VehiculoService } from "@/services/Vehiculo.service";
import { TOASTR } from "@/helpers/Alerts/Toastr";
import BreadCrumb from "@/components/BreadCrumb.vue";
import RoundButton from "@/components/buttons/Round.button.vue";
import DataTable from "@/components/DataTable/DataTable.vue";
import { SWEETALERT } from "@/helpers/Dialogs/Sweetalert";
import * as arrayHelpers from '@/functions/arrays'
import { ConfirmacionEnum } from "@/common/@types/Operacion.crud";
import { formatDate } from '@/functions/date/date';
export interface FormModelos {
  id?: number;
  nombre: string;
  slug: string;
  deleted: boolean;
  estado: boolean;
  marcaID: number
}
const BreadcrumbList = ref([
  { name: "Home", icon: "fa fa-home", url: "/dashboard" },
  { name: "Maestros", icon: "fa fa-edit" },
  { name: "Vehiculos", icon: "fas fa-business-time" },
]);
const MarcasAll = ref<any[]>([])
const ActiveModal = ref<Boolean>(false);
const EventSubmit = ref<Boolean>(false);
const Loading = ref<Boolean>(false);
const LoadingTabla = ref<Boolean>(false);
const _regMap = ref<Map<number, FormModelos>>()
const Tabla = ref<DatatableType>({
  header: [
    { _key: "id", label: "ID" },
    { _key: "nombre", label: "Nombre" },
    { _key: "marca", label: "Marca" },
    { _key: "modelo", label: "Modelo" },
    { _key: "combustible", label: "Combustible" },
    { _key: "grupo", label: "Grupo" },
    { _key: "tarjetaPropiedad", label: "Tarjeta Propiedad" },
    { _key: "tarjetaCirculacion", label: "Tarjeta Circulación" },
    { _key: "fechaVencTarjetaCirculacion", label: "Fecha Venc. Tarj. Circulación" },
    { _key: "fechaVencTarjetaPropiedad", label: "Fecha Venc. Tarj. Propiedad" },
    { _key: "placa", label: "Placa" },
    { _key: "motor", label: "Motor" },
    { _key: "anio", label: "Año" },
    { _key: "color", label: "Color" },
    { _key: "cilindrada", label: "Cilindrada" },
    { _key: "cilindros", label: "Cilindros" },
    { _key: "estado", label: "Estado" },
    { _key: "ope", label: "Operaciones" },
  ],
  data: [],
});

const Form = ref<FormModelos>({
  slug: "",
  nombre: "",
  deleted: false,
  estado: true,
  marcaID: 0
});


//* VALIDATE PARA VALIDACION DE FORMULARIOS
const rules = computed(() => ({
  slug: { required },
  nombre: { required },
  marcaID: { required },
}));

const v$ = useVuelidate(rules, Form);
/**FIN DE VALIACION */
/** MOUNTED ** CUANDO EL COMPONENTE SE RENDERIZA EN EL DOM  */
onMounted(() => {
  _fnListar();
});
/* METODOS*/

function _fnListar() {
  LoadingTabla.value = true;
  VehiculoService.fnGetListar()
    .then((res) => {
      if (res.status == 200) {
        // debugger
        const lista = res.data.body.map((x: any) => {
          return { ...x, ope: x.id }
        })
        console.log('Datos::', lista)
        debugger
        Tabla.value.data = lista;
        const registrosMap = arrayHelpers.ArrayToMap(lista, 'id')
        if (registrosMap) _regMap.value = registrosMap
      } else {
        Tabla.value.data = [];
      }
      LoadingTabla.value = false;
    })
    .catch((error) => {
      console.log(error);
      Tabla.value.data = [];
      TOASTR.error("Error al cargar informacion");
      LoadingTabla.value = false;
    });
}

function _fnInitFormulario() {
  EventSubmit.value = false;
  Form.value = { estado: true, deleted: false, slug: '', nombre: '', marcaID: 0 }
}
function _fnInitModels() {
  ActiveModal.value = false;
}


async function _fnConfirmacion(
  id: number,
  operacion: string = ConfirmacionEnum.ELIMINAR
) {
  const result = await SWEETALERT.Confirm.show(
    "Desea continuar con la operacion ?",
    operacion === ConfirmacionEnum.ELIMINAR ? "Eliminar!!!" : "Activar!!!"
  );
  if (result.isConfirmed) {
    const dataMap = _regMap.value
    const data = dataMap?.get(id)
    debugger
    if (data) {
      data.deleted = operacion === ConfirmacionEnum.ELIMINAR ? true : false
    }
    VehiculoService.fnPostRegistrar(data)
      .then((res) => {
        if (operacion == ConfirmacionEnum.ELIMINAR)
          TOASTR.warning("Registro Eliminado", "Eliminado");
        else TOASTR.success("Registro Activado", "Activado");
        _fnListar();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
async function enviarRegistros() {
  const form = { ...Form.value }
  Loading.value = true
  try {
    const result = await VehiculoService.fnPostRegistrar(form)
    console.log(result)
    TOASTR.success('Registro Correcto')
    Loading.value = false
    _fnListar()
  } catch (e) {
    console.log(e)
    TOASTR.error(e + '' || 'Error al registrar')
    Loading.value = false
  }
  Loading.value = false
}


</script>


<template>
  <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

  <q-card>
    <q-card-section>
      <div class="card-title flex align-items-center">
        <h6 class="flex-grow-1">
          <span class="fas fa-business-time"></span> Vehiculos
        </h6>
        <button type="button" class="btn btn-sm btn-outline-primary" @click="$router.push('vehiculo/register')">
          <span class="fa fa-plus"></span>&nbsp;Nuevo
        </button>
      </div>
      <hr />

      <data-table :data="Tabla.data" :header="Tabla.header" :loading="LoadingTabla" :filter="true">
        <template #body_ope="{ value, row }">
          <RoundButton bgFondoColor="yellow-8" 
            @click="$router.push('vehiculo/register/'+row.id)" icon="border_color" 
            title="Editar" text-color="white" />
          <RoundButton bgFondoColor="danger" title="Eliminar" 
          icon="delete_sweep" text-color="white" 
          @click="_fnConfirmacion(value)"/>
        </template>
        <template #body_fechaVencTarjetaCirculacion="{ value, row }">
         {{ formatDate(value,3) }}
        </template>
        <template #body_fechaVencTarjetaPropiedad="{ value, row }">
          {{ formatDate(value,3) }}
        </template>
      </data-table>
    </q-card-section>
  </q-card>
</template>


