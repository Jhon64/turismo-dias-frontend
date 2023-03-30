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
import { TOASTR } from "@helpers/Alerts/Toastr";
import { RolePermisosService } from "@/services/RolePermisos.service";
import { MenuService } from "@/services/Menu.service";
import type { ConfirmacionEnum } from "@types/Operacion.crud";
import { SWEETALERT } from "@helpers/Dialogs/Sweetalert";
import "./RolesPermisosView.scss";
import { permissionRole } from "@/plugins/permissionsRole";

/** INTERFACES */
export interface PropsDocumentosView {}

export interface FormRole {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  special?: string;
}

export interface IConfirmacionEnum {
  type: ConfirmacionEnum;
}

// ESTADOS
const BreadcrumbList = ref([
  { name: "Home", icon: "fa fa-home", url: "/dashboard" },
  { name: "Accesos", icon: "fa fa-edit" },
  { name: "Roles y Permisos", icon: "fas fa-file-archive" },
]);
const ConfirmacionEnum = ref<IConfirmacionEnum>();
const ActiveModal = ref<Boolean>(false);
const EventSubmit = ref<Boolean>(false);
const MenuIsPhone = ref<Number>(0);
const Loading = ref<Boolean>(false);
const Lista = ref([]);
const Menu: any = ref([]);
const MenuAux: any = ref([]);
const Rol: any = ref(null);

const Tabla = ref<DatatableType>({
  header: [
    { _key: "name", label: "Nombre" },
    { _key: "description", label: "Descripción" },
    // { _key: "correlative", label: "Correlativo" },
    // { _key: "serie_start_at", label: "Inicio de Serie" },
    { _key: "id", label: "Operaciones" },
  ],
  data: [],
});

const Form = ref<FormRole>({
  id: undefined,
  name: "",
  slug: "",
  description: "",
  special: "",
});

const ModalOperaciones = ref<{ title: string; operacion: TipoOperaciones }>({
  title: "Nuevo Voucher",
  operacion: "Add",
});

/**VALIDATE PARA VALIDACION DE FORMULARIOS */
const rules = computed(() => ({
  name: { required },
  slug: {},
  description: { required },
  special: {},
}));

const v$ = useVuelidate(rules, Form);
/**FIN DE VALIACION */
/** MOUNTED ** CUANDO EL COMPONENTE SE RENDERIZA EN EL DOM  */
onMounted(() => {
  _fnListar();
  _fnListarMenu(MenuIsPhone.value);
});
/* METODOS*/

function _fnListarMenu(is_phone: Number) {
  MenuService.fnGetListar({ is_phone })
    .then((res) => {
      if (res.status == 200) {
        MenuAux.value = res.data;
        Menu.value = _parseDataMenu(res.data);
        _handleChangeFilterSelectAll();
      } else {
        Menu.value = [];
      }
    })
    .catch((error) => {
      Tabla.value.data = [];
      TOASTR.error("Error al cargar informacion del menu");
    });
}

function _parseDataMenu(data: any) {
  return data?.map((dt: any) => {
    dt.select = false;
    dt.expand = false;
    dt.selectAll = false;
    dt.selectOne = false;
    if (dt.module.length > 0) {
      dt.module = dt.module.map((dtm: any) => {
        dtm.select = false;
        dtm.expand = false;
        dtm.selectAll = false;
        dt.selectOne = false;
        if (dtm.permission.length > 0) {
          dtm.permission = dtm.permission.map((dtp: any) => {
            dtp.select = false;
            return dtp;
          });
        }
        return dtm;
      });
    }
    return dt;
  });
}

function _fnListar() {
  RolePermisosService.fnGetListar()
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

function _fnOpenModal(type: TipoOperaciones = "Add", data: any = null) {
  ActiveModal.value = true;
  if (type == "Edit") {
    Rol.value = data;
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
      slug: data.slug,
      description: data.description,
      special: data.special,
    };

    const permissionRole = data.permissionRole;
    permissionRole.map((dt: any) => {
      Menu.value.map((dtme: any) => {
        if (dtme.module.length > 0) {
          dtme.module.map((dtmo: any) => {
            if (dtmo.permission.length > 0) {
              dtmo.permission.map((dtp: any) => {
                if (dt.permission) {
                  if (dt.permission.id == dtp.id) {
                    if (dt.active == 1) {
                      dtp.select = true;
                    }
                    dtp.permissionRole_id = dt.id;
                  }
                }
              });
            }
          });
        }
      });
    });
    _handleChangeFilterSelectAll();
    ModalOperaciones.value = {
      title: "Editar Rol",
      operacion: "Edit",
    };
  } else {
    ModalOperaciones.value = {
      title: "Nuevo Rol",
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
    slug: "",
    description: "",
    special: "",
  };
  Rol.value = null;
  MenuIsPhone.value = 0;
  const toggle: any = window.document.getElementById("is_phone_checkbox");
  toggle.checked = false;
  _fnListarMenu(MenuIsPhone.value);
}
function _fnCloseModal() {
  _fnInitFormulario();
  _fnInitModels();
  Menu.value = _parseDataMenu(MenuAux.value);
}

async function _fnRegistrar() {
  const isFormValid = await v$.value.$validate();
  EventSubmit.value = true;
  if (isFormValid) {
    Loading.value = true;
    const form = { ...Form.value, detail: Menu.value };
    RolePermisosService.fnPostRegistrar(form)
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
    RolePermisosService.fnEliminarOrActivar(id, operacion)
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

function _clickMenu(menu: any) {
  Menu.value = Menu.value.map((dt: any) => {
    if (menu.id == dt.id) {
      dt.expand = !menu.expand;
    } else {
      dt.expand = false;
    }
    return dt;
  });
  Menu.value;
}

function _clickModule(menu: any, module: any) {
  Menu.value = Menu.value.map((dt: any) => {
    if (menu.id == dt.id) {
      if (dt.module.length > 0) {
        dt.module = dt.module.map((dtm: any) => {
          if (dtm.id == module.id) {
            dtm.expand = !dtm.expand;
          } else {
            dtm.expand = false;
          }
          return dtm;
        });
      }
    }
    return dt;
  });
  _handleChangeFilterSelectAll();
}

function _handleClickMenu(menu: any) {
  Menu.value = Menu.value.map((dt: any) => {
    if (menu.id == dt.id) {
      const select = !dt.select;
      if (dt.module.length > 0) {
        dt.module = dt.module.map((dtm: any) => {
          dtm.select = select;
          if (dtm.permission.length > 0) {
            dtm.permission = dtm.permission.map((dtp: any) => {
              dtp.select = select;
              return dtp;
            });
          }
          return dtm;
        });
      }
    }
    return dt;
  });
  _handleChangeFilterSelectAll();
}

function _handleClickModule(menu: any, module: any) {
  Menu.value = Menu.value.map((dt: any) => {
    if (menu.id == dt.id) {
      if (dt.module.length > 0) {
        dt.module = dt.module.map((dtm: any) => {
          if (module.id == dtm.id) {
            dtm.select = !dtm.select;
            if (dtm.permission.length > 0) {
              dtm.permission = dtm.permission.map((dtp: any) => {
                dtp.select = dtm.select;
                return dtp;
              });
            }
          }
          return dtm;
        });
      }
    }
    return dt;
  });
  _handleChangeFilterSelectAll();
}

function _handleChangeFilterSelectAll() {
  Menu.value = Menu.value.map((menu: any) => {
    let countModuleAll = 0;
    let countModuleOne = 0;
    let moduleSelectAll = false;
    let moduleSelectOne = false;
    if (menu.module.length > 0) {
      menu.module = menu.module.map((module: any) => {
        let countPermission = 0;
        let permissionSelectAll = false;
        let permissionSelectOne = false;
        if (module.permission.length > 0) {
          module.permission = module.permission.map((permission: any) => {
            if (permission.select) countPermission = countPermission + 1;
            return permission;
          });
        }

        if (countPermission == 0) {
          permissionSelectAll = false;
          permissionSelectOne = false;
        } else if (countPermission < module.permission.length) {
          permissionSelectAll = false;
          permissionSelectOne = true;
        } else if (countPermission == module.permission.length) {
          permissionSelectAll = true;
          permissionSelectOne = false;
        }
        module.selectAll = permissionSelectAll;
        module.selectOne = permissionSelectOne;

        if (module.selectAll || module.selectOne) module.select = true;
        else module.select = false;

        if (module.selectAll) countModuleAll = countModuleAll + 1;
        if (module.selectOne) countModuleOne = countModuleOne + 1;

        return module;
      });
    }

    if (countModuleAll == menu.module.length) {
      moduleSelectAll = true;
      moduleSelectOne = false;
    } else if (
      (countModuleOne < menu.module.length ||
        countModuleAll < menu.module.length) &&
      (countModuleOne > 0 || countModuleAll > 0)
    ) {
      moduleSelectAll = false;
      moduleSelectOne = true;
    } else {
      moduleSelectAll = false;
      moduleSelectOne = false;
    }

    menu.selectAll = moduleSelectAll;
    menu.selectOne = moduleSelectOne;
    if (menu.selectAll || menu.selectOne) menu.select = true;
    else menu.select = false;
    return menu;
  });
}

function _hangleClickInput(permission: any) {
  Menu.value = Menu.value.map((dt: any) => {
    if (dt.module.length > 0) {
      dt.module = dt.module.map((dtm: any) => {
        if (dtm.permission.length > 0) {
          dtm.permission = dtm.permission.map((dtp: any) => {
            if (permission.id == dtp.id) {
              dtp.select = !dtm.select;
            }
            return dtp;
          });
        }
        return dtm;
      });
    }
    return dt;
  });

  _handleChangeFilterSelectAll();
}

async function _handleChangeMenuIsPhone() {
  if (MenuIsPhone.value == 1) {
    MenuIsPhone.value = 0;
  } else {
    MenuIsPhone.value = 1;
  }

  MenuService.fnGetListar({ is_phone: MenuIsPhone.value })
    .then((res) => {
      if (res.status == 200) {
        MenuAux.value = res.data;
        Menu.value = _parseDataMenu(res.data);
        _fnSetearInformacion(Rol.value, "Edit");
        _handleChangeFilterSelectAll();
      } else {
        Menu.value = [];
      }
    })
    .catch((error) => {
      Tabla.value.data = [];
      TOASTR.error("Error al cargar informacion del menu");
    });
}
</script>
<template>
  <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

  <q-card>
    <q-card-section>
      <div class="card-title flex align-items-center">
        <h6 class="flex-grow-1">
          <span class="fas fa-file-archive"></span> Roles y Permisos
        </h6>
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          @click="_fnOpenModal()"
          v-if="permissionRole('roles-permisos.create')"
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
                v-if="permissionRole('roles-permisos.edit')"
              />
              <RoundButton
                bgFondoColor="danger"
                title="Eliminar"
                icon="delete_sweep"
                text-color="white"
                @click="_fnConfirmacion(value)"
                v-if="permissionRole('roles-permisos.destroy')"
              />
            </template>
            <template v-else>
              <RoundButton
                bgFondoColor="green"
                title="Activar"
                icon="task_alt"
                text-color="white"
                @click="_fnConfirmacion(value, 'Activar')"
                v-if="permissionRole('roles-permisos.change_status')"
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
            placeholder="Administrador"
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
          <label class="form-label text-muted">Descripcion</label>
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Rol encargado de hacer..."
            :class="v$.description.$error && EventSubmit ? 'is-invalid' : ''"
            v-model="v$.description.$model"
          />
          <div
            v-if="v$.description.$error && EventSubmit"
            class="invalid-feedback"
          >
            Este Campo es requerido
          </div>
        </div>
      </div>
      <div style="width: 100%; padding-top: 15px">
        <div style="display: flex; justify-content: space-between">
          <label for="" style="padding: 5px 0px">Lista de Permisos</label>
          <div style="display: flex; align-items: center">
            <label for="" style="margin-right: 5px">Movil</label>
            <label class="switch">
              <input
                id="is_phone_checkbox"
                type="checkbox"
                :value="MenuIsPhone"
                @change="_handleChangeMenuIsPhone()"
              />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div v-for="(item, index) in Menu">
          <div v-if="item.module.length > 0">
            <q-icon
              name="arrow_drop_down"
              v-if="item.expand"
              @click="_clickMenu(item)"
              style="cursor: pointer"
            ></q-icon>
            <q-icon
              name="arrow_right"
              v-else
              @click="_clickMenu(item)"
              style="cursor: pointer"
            ></q-icon>
            <input
              class="form-check-input"
              v-if="item.selectOne"
              type="checkbox"
              v-model="item.select"
              :id="item.id"
              @click="_handleClickMenu(item)"
              style="margin-left: 5px; background-color: gray !important"
            />
            <input
              v-else
              class="form-check-input"
              type="checkbox"
              v-model="item.select"
              :id="item.id"
              @click="_handleClickMenu(item)"
              style="margin-left: 5px"
            />
            <label class="form-check-label" style="margin-left: 5px">
              {{ item.name }}
            </label>
          </div>
          <div class="form-check" v-else>
            <input
              class="form-check-input"
              type="checkbox"
              v-model="item.select"
              :id="item.id"
            />
            <label class="form-check-label">
              {{ item.name }}
            </label>
          </div>
          <div
            v-if="item.expand"
            v-for="itemModule in item.module"
            style="margin-left: 10px"
          >
            <div v-if="itemModule.permission.length > 0">
              <q-icon
                name="arrow_drop_down"
                v-if="itemModule.expand"
                @click="_clickModule(item, itemModule)"
                style="cursor: pointer"
              ></q-icon>
              <q-icon
                name="arrow_right"
                v-else
                @click="_clickModule(item, itemModule)"
                style="cursor: pointer"
              ></q-icon>
              <input
                type="checkbox"
                v-model="itemModule.select"
                :id="itemModule.id"
                @click="_handleClickModule(item, itemModule)"
                style="margin-left: 5px; background-color: gray !important"
                class="form-check-input"
                v-if="itemModule.selectOne"
              />
              <input
                type="checkbox"
                v-model="itemModule.select"
                :id="itemModule.id"
                @click="_handleClickModule(item, itemModule)"
                style="margin-left: 5px"
                class="form-check-input"
                v-else
              />
              <label class="form-check-label" style="margin-left: 5px">
                {{ itemModule.name }}
              </label>
            </div>
            <div class="form-check" v-else>
              <input
                class="form-check-input"
                type="checkbox"
                style="color: aqua"
                v-model="itemModule.select"
                :id="itemModule.id"
              />
              <label class="form-check-label">
                {{ itemModule.name }}
              </label>
            </div>
            <div v-if="itemModule.permission.length > 0">
              <div
                v-if="itemModule.expand"
                v-for="itemPermission in itemModule.permission"
                style="margin-left: 25px"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="itemPermission.select"
                  :id="itemPermission.id"
                  @click="_hangleClickInput(itemPermission)"
                />
                <label class="form-check-label" style="margin-left: 5px">
                  {{ itemPermission.name }}
                </label>
              </div>
            </div>
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
