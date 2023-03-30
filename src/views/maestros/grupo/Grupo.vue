<script lang="ts" setup>
import {computed, onMounted, ref,reactive} from "vue";
import type {DatatableType} from "@/common/@types/datatable";
import {required} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {TOASTR} from "@/helpers/Alerts/Toastr";
import BreadCrumb from "@/components/BreadCrumb.vue";
import StatusLabel from "@/components/labels/StatusLabel.vue";
import ModalComponent from "@/components/Modal.vue";
import RoundButton from "@/components/buttons/Round.button.vue";
import DataTable from "@/components/DataTable/DataTable.vue";
import type { TipoOperaciones } from "@/common/@types/TipoOperaciones";
import type { ConfirmacionEnum } from "@common/Operacion.crud";
import { SWEETALERT } from "@/helpers/Dialogs/Sweetalert";
import type { IConfirmacionEnum } from "@/views/accesos/rolesPremisos/RolesPermisosView.vue";
import * as arrayHelpers from '@/functions/arrays'
import { GrupoService } from "@/services/Grupo.service";

export interface FormCombustible {
  id?: number;
  nombre: string;
  deleted: boolean;
  estado: boolean;
}
const BreadcrumbList = ref([
  { name: "Home", icon: "fa fa-home", url: "/dashboard" },
  { name: "Maestros", icon: "" },
  { name: "Combustible", icon: "" },
]);
const ConfirmacionEnum = ref<IConfirmacionEnum>();
const ActiveModal = ref<Boolean>(false);
const EventSubmit = ref<Boolean>(false);
const Loading = ref<Boolean>(false);
const LoadingTabla = ref<Boolean>(false);
const Tabla = ref<DatatableType>({
  header: [
    { _key: "nombre", label: "Nombre" },
    { _key: "estado", label: "Estado" },
    { _key: "id", label: "Operaciones" },
  ],
  data: [],
});
const _regMap=ref<Map<number,FormCombustible>>()

const Form = ref<FormCombustible>({
  nombre: "",
  deleted:false,
  estado:true
});


//* VALIDATE PARA VALIDACION DE FORMULARIOS
const rules = computed(() => ({
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
  GrupoService.fnGetListar()
    .then((res) => {
      if (res.status == 200) {
        const lista=res.data.body
        Tabla.value.data = lista;
        // debugger
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
  Form.value={estado:true,deleted:false,nombre:''}
}
function _fnInitModels() {
  ActiveModal.value = false;
}

function _fnSetearInformacion(data: any, type: TipoOperaciones = "Add") {
  if (type == "Edit") {
    Form.value = {
      id: data.id,
      nombre: data.nombre,
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

async function  enviarRegistros(){
  const form={...Form.value}
  Loading.value=true
  try {
    const result=await GrupoService.fnPostRegistrar(form)
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
    // debugger
    if (data) {
      data.deleted=operacion === ConfirmacionEnum.ELIMINAR ? true: false
    }
    GrupoService.fnPostRegistrar(data)
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

</script>


<template>
  <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

  <q-card>
    <q-card-section>
      <div class="card-title flex align-items-center">
        <h6 class="flex-grow-1">
          <span class=""></span> Combustible
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
        <h6 class="modal-title">{{Form.id?'EDITAR COMBUSTIBLE':'NUEVA COMBUSTIBLE'}}</h6>
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
      <div class="mt-3 text-right">
        <button class="btn btn-sm btn-outline-danger"
         @click="_fnCloseModal()">
          <span class="fa fa-times"  ></span>&nbsp;Cancelar
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


