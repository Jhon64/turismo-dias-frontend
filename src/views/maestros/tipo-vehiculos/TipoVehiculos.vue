<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import type {DatatableType} from "@/common/@types/datatable";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {TipoVehiculoService} from "@/services/TipoVehiculo.service";
import {TOASTR} from "@/helpers/Alerts/Toastr";
import BreadCrumb from "@/components/BreadCrumb.vue";
import StatusLabel from "@/components/labels/StatusLabel.vue";
import ModalComponent from "@/components/Modal.vue";
import RoundButton from "@/components/buttons/Round.button.vue";
import DataTable from "@/components/DataTable/DataTable.vue";
import type { TipoOperaciones } from "@/common/@types/TipoOperaciones";

import { SWEETALERT } from "@/helpers/Dialogs/Sweetalert";
import type { IConfirmacionEnum } from "@/views/accesos/rolesPremisos/RolesPermisosView.vue";
import * as arrayHelpers from '@/functions/arrays'
import { ConfirmacionEnum } from "@/common/@types/Operacion.crud";
export interface FormTipoVehiculo {
  id?: number;
  nombre: string;
  slug: string;
  deleted: boolean;
  estado: boolean;
}
const BreadcrumbList = ref([
  { name: "Home", icon: "fa fa-home", url: "/dashboard" },
  { name: "Maestros", icon: "fa fa-edit" },
  { name: "Tipo Vehiculos", icon: "fas fa-business-time" },
]);
const ActiveModal = ref<Boolean>(false);
const EventSubmit = ref<Boolean>(false);
const Loading = ref<Boolean>(false);
const LoadingTabla = ref<Boolean>(false);
const Tabla = ref<DatatableType>({
  header: [
    { _key: "nombre", label: "Nombre" },
    { _key: "slug", label: "Slug" },
    { _key: "estado", label: "Estado" },
    { _key: "id", label: "Operaciones" },
  ],
  data: [],
});
const _regMap=ref<Map<number,FormTipoVehiculo>>()
const Form = ref<FormTipoVehiculo>({
  slug: "",
  nombre: "",
  deleted:false,
  estado:true
});


//* VALIDATE PARA VALIDACION DE FORMULARIOS
const rules = computed(() => ({
  slug: { required },
  nombre: { required },
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
  TipoVehiculoService.fnGetListar()
    .then((res) => {
      if (res.status == 200) {
        const lista=res.data.body
        Tabla.value.data = lista;
        const registrosMap = arrayHelpers.ArrayToMap(lista, 'id')
          if(registrosMap)_regMap.value=registrosMap
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
  Form.value={estado:true,deleted:false,slug:'',nombre:''}
}
function _fnInitModels() {
  ActiveModal.value = false;
}

function _fnSetearInformacion(data: any, type: TipoOperaciones = "Add") {
  if (type == "Edit") {
    Form.value = {
      id: data.id,
      nombre: data.nombre,
      slug: data.slug,
      estado: data.estado,
      deleted:data.deleted
    };
   
  } else {
    _fnInitFormulario();
  }
}

function _fnCloseModal() {
  _fnInitFormulario();
  _fnInitModels();
}

function _fnOpenModal(type: TipoOperaciones = "Add", data: any = null) {
  ActiveModal.value = true;
  if (type == "Edit") {
    data.deleted=false
    _fnSetearInformacion(data, type);
  } else {
    _fnSetearInformacion(data);
  }
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
    const data=dataMap?.get(id)
     debugger
    if (data) {
      data.deleted=operacion === ConfirmacionEnum.ELIMINAR ? true: false
    }
    TipoVehiculoService.fnPostRegistrar(data)
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

async function  enviarRegistros(){
  const form={...Form.value}
  Loading.value=true
  try {
    const result=await TipoVehiculoService.fnPostRegistrar(form)
    console.log(result)
    TOASTR.success('Registro Correcto')
    Loading.value=false
   _fnCloseModal()
    _fnListar()
  }catch (e) {
    console.log(e)
    TOASTR.error(e+''||'Error al registrar')
    Loading.value=false
  }
  Loading.value=false
}
</script>


<template>
  <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

  <q-card>
    <q-card-section>
      <div class="card-title flex align-items-center">
        <h6 class="flex-grow-1">
          <span class="fas fa-business-time"></span> Tipo De Vehiculos
        </h6>
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          @click="_fnOpenModal()"
        >
          <span class="fa fa-plus"></span>&nbsp;Nuevo
        </button>
      </div>
      <hr />

      <data-table
        :data="Tabla.data"
        :header="Tabla.header"
        :loading="LoadingTabla"
        :filter="true"
      >
        <template #body_estado="{ value, row }">
          <StatusLabel :status="value" />
        </template>
        <template #body_id="{ value, row }">
          <div>
            <!--  el campo row va en referencia de la cabecera que se la ha pasado
            a la table -->
            <template v-if="row.estado === true">
              <RoundButton
                bgFondoColor="yellow-8"
                icon="border_color"
                title="Editar"
                text-color="white"
                @click="_fnOpenModal('Edit',row)"

              />
              <RoundButton
                bgFondoColor="danger"
                title="Eliminar"
                icon="delete_sweep"
                text-color="white"
                @click="_fnConfirmacion(value)"
              />
            </template>
            <template v-else>
              <RoundButton
                bgFondoColor="green"
                title="Activar"
                icon="task_alt"
                text-color="white"

              />
            </template>
          </div>
        </template>
      </data-table>
    </q-card-section>
  </q-card>

  <ModalComponent :active="ActiveModal" :show-footer="false">
    <template #header>
      <div class="modal-header py-3">
        <h6 class="modal-title">{{Form.id?'EDITAR TIPO VEHICULO':'NUEVO TIPO VEHICULO'}}</h6>
      </div>
    </template>
    <div class="container-fluid">
      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="form-label text-muted">Nombre</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Nombre"
            :class="v$.nombre.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.nombre.$model"
          />
          <div v-if="v$.nombre.$error && EventSubmit" class="invalid-feedback">
            Este Campo es requerido
          </div>
        </div>
      </div>
      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="form-label text-muted">Slug</label>
          <textarea
            type="text"
            class="form-control form-control-sm"
            placeholder="Slug"
            :class="v$.slug.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.slug.$model"
            rows="2"
          />
          <div
            v-if="v$.slug.$error && EventSubmit"
            class="invalid-feedback"
          >
            Este Campo es requerido
          </div>
        </div>
      </div>

      <div class="mt-3 text-right">
        <button class="btn btn-sm btn-outline-danger"
        @click="_fnCloseModal()">
          <span class="fa fa-times"></span>&nbsp;Cancelar
        </button>
        &nbsp;
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="Loading"
          @click="enviarRegistros"
        >
          <template v-if="Loading">
            <q-spinner-hourglass size="xs" />
            Registrando ...
          </template>
          <template v-else>
            <span class="fa fa-save"></span>&nbsp;Registrar
          </template>
        </button>
      </div>
    </div>
  </ModalComponent>
</template>


