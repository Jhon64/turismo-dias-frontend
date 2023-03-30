<script lang="ts" setup>
import type { BreadcrumbItem } from "@types/breadcrumb";
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import BreadCrumb from "@components/BreadCrumb.vue";
import ModalComponent from "@components/Modal.vue";
import DataTable from "@components/DataTable/DataTable.vue";
import StatusLabel from "@components/labels/StatusLabel.vue";
import type { TipoOperaciones } from "@types/TipoOperaciones";
import { DatatableType } from "@types/datatable";
import RoundButton from "@components/buttons/Round.button.vue";
import useVuelidate from "@vuelidate/core";
import { minLength, required } from "@vuelidate/validators";
import { AreaService } from "@services/Area.service";
import { TOASTR } from "@helpers/Alerts/Toastr";
import { RolePermisosService } from "@/services/RolePermisos.service";
import type { ConfirmacionEnum } from "@types/Operacion.crud";
import { SWEETALERT } from "@helpers/Dialogs/Sweetalert";
import { UserService } from "@/services/User.service";
import { permissionRole } from "@/plugins/permissionsRole";
import { StorageHelper } from "@/helpers/LocalStorage/storage.helper";

/** INTERFACES */
export interface PropsDocumentosView {}

export interface FormUser {
  id?: number;
  name: string;
  last_name: string;
  userLogin: string;
  password?: string;
  rol_id: string;
  roleUser_id?: string;
}
export interface IConfirmacionEnum {
  type: ConfirmacionEnum;
}

// ESTADOS
const BreadcrumbList = ref([
  { name: "Home", icon: "fa fa-home", url: "/dashboard" },
  { name: "Accesos", icon: "fa fa-edit" },
  { name: "Usuarios", icon: "fas fa-file-archive" },
]);
const ConfirmacionEnum = ref<IConfirmacionEnum>();
const ActiveModal = ref<Boolean>(false);
const EventSubmit = ref<Boolean>(false);
const Loading = ref<Boolean>(false);
const Lista = ref([]);
const Roles = ref([]);

const Tabla = ref<DatatableType>({
  header: [
    { _key: "name", label: "Nombre" },
    { _key: "last_name", label: "Apellido" },
    { _key: "userLogin", label: "Correo o Usuario" },
    { _key: "role_name", label: "Rol" },
    { _key: "id", label: "Operaciones" },
  ],
  data: [],
});

const Form = ref<FormUser>({
  id: undefined,
  name: "",
  last_name: "",
  userLogin: "",
  password: "",
  rol_id: "",
  roleUser_id: "",
});
const ModalOperaciones = ref<{ title: string; operacion: TipoOperaciones }>({
  title: "Nuevo Usuarios",
  operacion: "Add",
});

/**VALIDATE PARA VALIDACION DE FORMULARIOS */
const rules = computed(() => ({
  name: { required },
  last_name: { required },
  userLogin: { required },
  password: {},
  rol_id: {},
}));

const v$ = useVuelidate(rules, Form);
/**FIN DE VALIACION */
/** MOUNTED ** CUANDO EL COMPONENTE SE RENDERIZA EN EL DOM  */
onMounted(() => {
  _fnListar();
  _fnListarRoles();
});
/* METODOS*/

function _fnListar() {
  UserService.fnGetListar()
    .then((res) => {
      if (res.status == 200) {
        Tabla.value.data = res.data;
      } else {
        Tabla.value.data = [];
      }
    })
    .catch((error) => {
      Tabla.value.data = [];
      TOASTR.error("Error al cargar informacion");
    });
}

function _fnListarRoles() {
  RolePermisosService.fnGetListar()
    .then((res) => {
      if (res.status == 200) {
        Roles.value = res.data;
      } else {
        Roles.value = [];
      }
    })
    .catch((error) => {
      Roles.value = [];
      TOASTR.error("Error al cargar informacion");
    });
}

function _fnOpenModal(type: TipoOperaciones = "Add", data: any = null) {
  ActiveModal.value = true;
  if (type == "Edit") {
    _fnSetearInformacion(data, type);
  } else {
    _fnSetearInformacion(data);
  }
}

function _fnSetearInformacion(data: any, type: TipoOperaciones = "Add") {
  if (type == "Edit") {
    Form.value = {
      id: data.id,
      name: data.name,
      last_name: data.last_name,
      userLogin: data.userLogin,
      rol_id: data.role.id,
      roleUser_id: data.roleUser.id,
    };
    ModalOperaciones.value = {
      title: "Editar Usuario",
      operacion: "Edit",
    };
  } else {
    ModalOperaciones.value = {
      title: "Nuevo Usuario",
      operacion: "Add",
    };
  }
}

function _fnInitModels() {
  ActiveModal.value = false;
  ModalOperaciones.value = {
    title: "Nuevo documento",
    operacion: "Add",
  };
}

function _fnInitFormulario() {
  EventSubmit.value = false;
  Form.value = {
    id: undefined,
    name: "",
    last_name: "",
    userLogin: "",
    password: "",
    rol_id: "",
    roleUser_id: "",
  };
}

function _fnCloseModal() {
  _fnInitFormulario();
  _fnInitModels();
}

async function _fnRegistrar() {
  const isFormValid = await v$.value.$validate();
  EventSubmit.value = true;
  if (isFormValid) {
    Loading.value = true;
    const form = {
      ...Form.value,
      userName: Form.value.userLogin,
      password: Form.value.password?.length > 0 ? Form.value.password : "",
    };
    UserService.fnPostRegistrar(form)
      .then((res) => {
        _fnInitFormulario();
        _fnInitModels();
        Loading.value = false;
        TOASTR.success("Informacion registrada");
        _fnListar();
      })
      .catch((error) => {
        console.log(error);
        Loading.value = false;
        TOASTR.error("Error al registrar informacion");
      });
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
    UserService.fnEliminarOrActivar(id, operacion)
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
          <span class="fas fa-file-archive"></span> Usuarios
        </h6>
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          @click="_fnOpenModal()"
          v-if="permissionRole('usuarios.create')"
        >
          <span class="fa fa-plus"></span>&nbsp;Nuevo
        </button>
      </div>
      <hr />

      <data-table :data="Tabla.data" :header="Tabla.header" :filter="false">
        <template #body_status="{ value, row }">
          <StatusLabel :status="value" />
        </template>
        <template #body_id="{ value, row }">
          <div>
            <!--  el campo row va en referencia de la cabecera que se la ha pasado
            a la table -->
            <template v-if="row.status === true">
              <RoundButton
                bgFondoColor="yellow-8"
                icon="border_color"
                title="Editar"
                text-color="white"
                @click="_fnOpenModal('Edit', row)"
                v-if="permissionRole('usuarios.edit')"
              />
              <RoundButton
                bgFondoColor="danger"
                title="Eliminar"
                icon="delete_sweep"
                text-color="white"
                @click="_fnConfirmacion(value)"
                v-if="permissionRole('usuarios.destroy')"
              />
            </template>
            <template v-else>
              <RoundButton
                bgFondoColor="green"
                title="Activar"
                icon="task_alt"
                text-color="white"
                @click="_fnConfirmacion(value, 'Activar')"
                v-if="permissionRole('usuarios.change_status')"
              />
            </template>
          </div>
        </template>
        <template #body_area="{ value, row }">
          {{ value.nombre }}
        </template>
      </data-table>
    </q-card-section>
  </q-card>

  <ModalComponent :active="ActiveModal" :show-footer="false">
    <template #header>
      <div class="modal-header py-3">
        <h6 class="modal-title">{{ ModalOperaciones?.title }}</h6>
      </div>
    </template>
    <div>
      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="form-label text-muted">Nombre</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder=""
            :class="v$.name.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.name.$model"
          />
          <div v-if="v$.name.$error && EventSubmit" class="invalid-feedback">
            Este Campo es requerido
          </div>
        </div>
      </div>
      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="form-label text-muted">Apellidos</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder=""
            :class="v$.last_name.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.last_name.$model"
          />
          <div
            v-if="v$.last_name.$error && EventSubmit"
            class="invalid-feedback"
          >
            Este Campo es requerido
          </div>
        </div>
      </div>
      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="form-label text-muted">Correo o Usuario</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder=""
            :class="v$.userLogin.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.userLogin.$model"
          />
          <div
            v-if="v$.userLogin.$error && EventSubmit"
            class="invalid-feedback"
          >
            Este Campo es requerido
          </div>
        </div>
      </div>
      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="form-label text-muted">Password</label>
          <input
            type="password"
            class="form-control form-control-sm"
            placeholder="*********"
            :class="v$.password.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.password.$model"
          />
          <div
            v-if="v$.password.$error && EventSubmit"
            class="invalid-feedback"
          >
            Este Campo es requerido
          </div>
        </div>
      </div>

      <div class="mb-1">
        <div class="form-group has-danger">
          <label class="mb-0 form-label text-muted">Rol</label>
          <select
            class="form-control form-control-sm"
            :class="v$.rol_id.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.rol_id.$model"
          >
            <option
              v-for="(item, index) in Roles"
              :key="index"
              :value="item.id"
            >
              {{ item.name }}
            </option>
          </select>
          <div v-if="v$.rol_id.$error && EventSubmit" class="invalid-feedback">
            Este Campo es requerido
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="mt-3 text-right">
        <button class="btn btn-sm btn-outline-danger" @click="_fnCloseModal()">
          <span class="fa fa-times"></span>&nbsp;Cancelar
        </button>
        &nbsp;
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="Loading"
          @click="_fnRegistrar()"
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
