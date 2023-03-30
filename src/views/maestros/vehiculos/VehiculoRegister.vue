<script lang="ts" setup>
import 'v-calendar/style.css';
import BreadCrumb from "@/components/BreadCrumb.vue";
import Calendar from "@/components/calendar/Calendar.vue";
import { TOASTR } from "@/helpers/Alerts/Toastr";
import { LoadingSpinner } from "@/helpers/Spinner/Loading.spinner";
import { CombustibleService } from "@/services/Combustible.service";
import { GrupoService } from "@/services/Grupo.service";
import { MarcaService } from "@/services/Marcas.service";
import { ModelosService } from "@/services/Modelos.service";
import { TipoVehiculoService } from "@/services/TipoVehiculo.service";
import { onMounted, reactive, ref } from "vue";
import { VehiculoService } from '@/services/Vehiculo.service';
import { useRoute, useRouter } from 'vue-router';
import FileUpload from "@/components/files/FileUpload.vue";
export interface FormModelos {
   id?: number;
   nombre: string;
   slug: string;
   deleted: boolean;
   estado: boolean;
   marcaID: number
}
const _router = ref(useRouter())
const _route = ref(useRoute())
const _id = ref<any>(null)
const _listas = reactive({ marcas: [], tipoVehiculo: [], modelos: [], combustible: [], grupo: [] })
const BreadcrumbList = ref([
   { name: "Home", icon: "fa fa-home", url: "/dashboard" },
   { name: "Maestros", icon: "fa fa-edit" },
   { name: "Vehiculos", url: "/maestros/vehiculos", icon: "fas fa-business-time" },
   { name: "Register", icon: "" },
]);
const EventSubmit = ref<Boolean>(false);
const _state = reactive<any>({ form: {}, defaultFechas: {} });

/**FIN DE VALIACION */
/** MOUNTED ** CUANDO EL COMPONENTE SE RENDERIZA EN EL DOM  */
onMounted(async () => {
   const tempId = _route.value.params.id
   _id.value = tempId
   const apisAll = await Promise.all([
      MarcaService.fnGetListar(),
      TipoVehiculoService.fnGetListar(),
      ModelosService.fnGetListar(),
      CombustibleService.fnGetListar(),
      GrupoService.fnGetListar()
   ])
   if (apisAll[0]) {
      const _result = apisAll[0]
      const list = _result.data.body
      _listas.marcas = list
   }
   if (apisAll[1]) {
      const _result = apisAll[1]
      const list = _result.data.body
      _listas.tipoVehiculo = list
   }
   if (apisAll[2]) {
      const _result = apisAll[2]
      const list = _result.data.body
      _listas.modelos = list
   }
   if (apisAll[3]) {
      const _result = apisAll[3]
      const list = _result.data.body
      _listas.combustible = list
   }
   if (apisAll[4]) {
      const _result = apisAll[4]
      const list = _result.data.body
      _listas.grupo = list
   }
   if (_id.value) {
      console.log('Cargando id de vehiculo::', _id.value)
      _fnListar(_id.value)
      _state.form.id = _id.value
   }

});
/* METODOS*/

function _fnSetearInformacion(data: any) {
   console.log('data setear ::', data)
   if (data.nombre) _state.form.nombre = data.nombre
   if (data.vinSin) _state.form.vinSin = data.vinSin
   if (data.placa) _state.form.placa = data.placa
   if (data.anio) _state.form.anio = data.anio
   if (data.marcaID) _state.form.marcaID = data.marcaID
   if (data.modeloID) _state.form.modeloID = data.modeloID
   if (data.provinciaRegistro) _state.form.provinciaRegistro = data.provinciaRegistro
   if (data.tarjetaCirculacion) _state.form.tarjetaCirculacion = data.tarjetaCirculacion

   if (data.fechaVencTarjetaCirculacion) {

      _state.form.fechaVencTarjetaCirculacion = data.fechaVencTarjetaCirculacion;
      _state.defaultFechas.fechaVencTarjetaCirculacion = data.fechaVencTarjetaCirculacion;
   }
   if (data.tarjetaPropiedad) _state.form.tarjetaPropiedad = data.tarjetaPropiedad
   if (data.fechaVencTarjetaPropiedad) {
      debugger
      _state.form.fechaVencTarjetaPropiedad = data.fechaVencTarjetaPropiedad
      _state.defaultFechas.fechaVencTarjetaPropiedad = data.fechaVencTarjetaPropiedad;
   }
   if (data.estado) _state.form.estado = data.estado
   if (data.grupoID) _state.form.grupoID = data.grupoID
   if (data.fotografia) _state.form.fotografia = data.fotografia
   if (data.propiedad) _state.form.propiedad = data.propiedad
   if (data.color) _state.form.color = data.color
   if (data.tipoVehiculoID) _state.form.tipoVehiculoID = data.tipoVehiculoID
   if (data.motor) _state.form.motor = data.motor
   if (data.cilindros) _state.form.cilindros = data.cilindros
   if (data.cilindrada) _state.form.cilindrada = data.cilindrada
   if (data.combustibleID) _state.form.combustibleID = data.combustibleID
}

function _fnListar(id?: number) {

   VehiculoService.fnGetListar(id)
      .then((res) => {
         if (res.status == 200) {
            const lista = res.data.body
            _fnSetearInformacion(lista[0])
            debugger
         } else {
            TOASTR.error("Error al cargar informacion");
         }
      })
      .catch((error) => {
         console.log(error);
         TOASTR.error(error?.message || "Error al cargar informacion");

      });
}
async function _fnEnviarRegistros() {
   LoadingSpinner.Circle('Cargando informacion')
   const form = _state.form
   console.log('reg a enviar', form)
   try {
      const formulario = new FormData();
      if (_state.form.id) formulario.append('id', _state.form.id)
      if (_state.form.fotografiaFile) formulario.append('fotografiaFile', _state.form.fotografiaFile)
      if (_state.form.nombre) formulario.append('nombre', _state.form.nombre)
      if (_state.form.vinSin) formulario.append('vinSin', _state.form.vinSin)
      if (_state.form.placa) formulario.append('placa', _state.form.placa)
      if (_state.form.anio) formulario.append('anio', _state.form.anio)
      if (_state.form.marcaID) formulario.append('marcaID', _state.form.marcaID)
      if (_state.form.modeloID) formulario.append('modeloID', _state.form.modeloID)
      if (_state.form.provinciaRegistro) formulario.append('provinciaRegistro', _state.form.provinciaRegistro)
      if (_state.form.tarjetaCirculacion) formulario.append('tarjetaCirculacion', _state.form.tarjetaCirculacion)
      if (_state.form.fechaVencTarjetaCirculacion) formulario.append('fechaVencTarjetaCirculacion', _state.form.fechaVencTarjetaCirculacion)
      if (_state.form.tarjetaPropiedad) formulario.append('tarjetaPropiedad', _state.form.tarjetaPropiedad)
      if (_state.form.fotografia) formulario.append('fotografia', _state.form.fotografia)
      if (_state.form.fechaVencTarjetaPropiedad) formulario.append('fechaVencTarjetaPropiedad', _state.form.fechaVencTarjetaPropiedad)
      if (_state.form.estado) formulario.append('estado', _state.form.estado)
      if (_state.form.grupoID) formulario.append('grupoID', _state.form.grupoID)
      if (_state.form.propiedad) formulario.append('propiedad', _state.form.propiedad)
      if (_state.form.color) formulario.append('color', _state.form.color)
      if (_state.form.tipoVehiculoID) formulario.append('tipoVehiculoID', _state.form.tipoVehiculoID)
      if (_state.form.tipoVehiculoID) formulario.append('motor', _state.form.tipoVehiculoID)
      if (_state.form.cilindros) formulario.append('cilindros', _state.form.cilindros)
      if (_state.form.cilindrada) formulario.append('cilindrada', _state.form.cilindrada)
      if (_state.form.combustibleID) formulario.append('combustibleID', _state.form.combustibleID)
      const result = await VehiculoService.fnPostRegistrar(formulario)
      console.log('result ::', result)
      TOASTR.success('Informacion Registrada...')
      _router.value.push('/maestros/vehiculos')
   } catch (error) {
      TOASTR.error(error?.message + '' || 'Error al registrar')
      LoadingSpinner.Remove()
   }
   LoadingSpinner.Remove()
}

function _fnChangeArchivo(evt: any) {
   const files = evt.target.files
   const file = files[0]
   _state.form.fotografiaFile = file
}
//*LOS ARCHIVOS SON PDF WORD E IMAGENES
</script>



<template>
   <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

   <q-card>
      <q-card-section>
         <div class="card-title flex align-items-center">
            <h6 class="flex-grow-1">
               <span class="fas fa-car"></span> {{ _state.form.id ? 'EDITAR VEHICULO' : 'Nuevo Vehiculo' }}
            </h6>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="_fnEnviarRegistros()">
               <span class="fa fa-save"></span>&nbsp;Registrar
            </button>
         </div>
         <hr />
         <div class="row">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Nombre</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.nombre" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">VIN/SIN</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.vinSin" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Placa</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.placa" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Año</label>
                  <input type="number" class="form-control form-control-sm" v-model="_state.form.anio" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Marca</label>
                  <select placeholder="Marca" class="form-control form-control-sm" v-model="_state.form.marcaID">
                     <option value="">::Seleccione::</option>
                     <option v-for="_marca in _listas.marcas" :value="_marca.id">{{ _marca.nombre }}</option>
                  </select>

               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Modelo</label>
                  <select placeholder="Modelo" class="form-control form-control-sm" v-model="_state.form.modeloID">
                     <option value="">::Seleccione::</option>
                     <option v-for="_modelo in _listas.modelos.filter(x => x.marcaID == _state.form.marcaID)"
                        :value="_modelo.id">{{ _modelo.nombre }}</option>
                  </select>

               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Estado/Provincia Registro</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.provinciaRegistro" />

               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Tarjeta Circulación</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.tarjetaCirculacion" />

               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <Calendar label="Fecha Vencimiento Tarjeta Circulación" :format-unix-day="true"
                  :default="_state.defaultFechas.fechaVencTarjetaCirculacion"
                  @get-date="(dateValue) => _state.form.fechaVencTarjetaCirculacion = dateValue" />

            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Tarjeta Propiedad</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.tarjetaPropiedad" />

               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <Calendar label="Fecha Vencimiento Tarjeta Propiedad" :format-unix-day="true"
                  @get-date="(dateValue) => _state.form.fechaVencTarjetaPropiedad = dateValue"
                  :default="_state.defaultFechas.fechaVencTarjetaPropiedad" />
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Estado</label>
                  <select class="form-control form-control-sm" v-model="_state.form.estado">
                     <option value="">::Seleccione::</option>
                     <option value="Activo">Activo</option>
                     <option value="Fuera de Servicio">Fuera de Servicio</option>
                     <option value="En Mantenimiento">En Mantenimiento</option>
                  </select>

               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Grupo</label>
                  <select placeholder="Modelo" class="form-control form-control-sm" v-model="_state.form.grupoID">
                     <option value="">::Seleccione::</option>
                     <option v-for="_modelo in _listas.grupo" :value="_modelo.id">{{ _modelo.nombre }}</option>
                  </select>
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Propiedad</label>
                  <!-- <input type="text" class="form-control form-control-sm" v-model="_state.form.propiedad" /> -->

                  <select class="form-control form-control-sm" v-model="_state.form.propiedad">
                     <option value="">::Seleccione::</option>
                     <option value="PROPIO">PROPIO</option>
                     <option value="ALQUILADO">ALQUILADO</option>
                  </select>
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Color</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.color" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Tipo de Vehículo</label>
                  <select class="form-control form-control-sm" v-model="_state.form.tipoVehiculoID">
                     <option value="">::Seleccione::</option>
                     <option v-for="_tipo in _listas.tipoVehiculo" :value="_tipo.id">{{ _tipo.nombre }}</option>
                  </select>
               </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Motor</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.motor" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Cilindros</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.cilindros" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Cilindrada</label>
                  <input type="text" class="form-control form-control-sm" v-model="_state.form.cilindrada" />
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <div class="form-group">
                  <label class="form-label mb-0 text-muted">Combustible</label>
                  <select class="form-control form-control-sm" v-model="_state.form.combustibleID">
                     <option value="">::Seleccione::</option>
                     <option v-for="_combustible in _listas.combustible" :value="_combustible.id">{{ _combustible.nombre }}
                     </option>
                  </select>
               </div>
            </div>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-1">
               <!-- <div class="form-group">
                     <label class="form-label mb-0 text-muted">Fotografia</label>
                     <input type="file" class="form-control  form-control-sm" @change="$event => _fnChangeArchivo($event)" />
                  </div> -->
               <FileUpload label="Fotografia" @get-file="file => {
                  if (file) { _state.form.fotografiaFile = file }
                  else { delete _state.form.fotografiaFile }
               }" />
            </div>
         </div>
      </q-card-section>
   </q-card>
</template>


