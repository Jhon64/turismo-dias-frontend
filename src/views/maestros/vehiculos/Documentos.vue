<script lang="ts" setup>
import 'v-calendar/style.css';
import BreadCrumb from "@/components/BreadCrumb.vue";
import Calendar from "@/components/calendar/Calendar.vue";
import { TOASTR } from "@/helpers/Alerts/Toastr";
import { LoadingSpinner } from "@/helpers/Spinner/Loading.spinner";
import { onMounted, reactive, ref } from "vue";
import { VehiculoService } from '@/services/Vehiculo.service';
import { useRoute, useRouter } from 'vue-router';
import FileUpload from "@/components/files/FileUpload.vue";

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
const _state = reactive<any>({ form: {}, defaultFechas: {}, formEnviar: {} });

/**FIN DE VALIACION */
/** MOUNTED ** CUANDO EL COMPONENTE SE RENDERIZA EN EL DOM  */
onMounted(async () => {
    const tempId = _route.value.params.id
    _id.value = tempId
    _state.formEnviar.id = +tempId || undefined
    _fnListar(+tempId)

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
    if (data.marca) _state.form.marca = data.marca
    if (data.modelo) _state.form.modelo = data.modelo
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
        if (_state.formEnviar.id) formulario.append('id', _state.formEnviar.id)
        if (_state.formEnviar.documentos) {
            for(let file of _state.formEnviar.documentos)
            formulario.append('documentos', file)
        }
        const result = await VehiculoService.addDocumentos(formulario)
        console.log('result ::', result)
        if (result) {
            TOASTR.success('Informacion Registrada...')
            _router.value.push('/maestros/vehiculos')
        }

    } catch (error) {
        TOASTR.error(error?.message + '' || 'Error al registrar')
        LoadingSpinner.Remove()
    }
    LoadingSpinner.Remove()
}


</script>



<template>
    <BreadCrumb :breadcrumb="BreadcrumbList"></BreadCrumb>

    <q-card>
        <q-card-section>
            <div class="card-title flex align-items-center">
                <h6 class="flex-grow-1">
                    <span class="fas fa-car"></span> {{ 'Vehiculo' }}
                </h6>
            </div>
            <hr />
            <div class="row flex-wrap w-06x">
                <div class="form-group ">
                    <label class="form-label mb-0 text-muted w-06x">Nombre</label>
                    <label type="text" class="form-label mb-0">:&nbsp;{{ _state.form.nombre }}</label>
                </div>
                <div class="form-group ">
                    <label class="form-label mb-0 text-muted w-06x">Placa</label>
                    <label type="text" class="form-label mb-0">:&nbsp;{{ _state.form.placa }}</label>
                </div>
                <div class="form-group ">
                    <label class="form-label mb-0 text-muted w-06x">Año</label>
                    <label type="text" class="form-label mb-0">:&nbsp;{{ _state.form.anio }}</label>
                </div>
                <div class="form-group">
                    <label class="form-label mb-0 text-muted w-06x">Marca</label>
                    <label type="text" class="form-label mb-0">:&nbsp;{{ _state.form.marca }}</label>
                </div>
                <div class="form-group ">
                    <label class="form-label mb-0 text-muted w-06x">Modelo</label>
                    <label type="text" class="form-label mb-0">:&nbsp;{{ _state.form.modelo }}</label>
                </div>
                <div class="form-group ">
                    <label class="form-label mb-0 text-muted w-06x">Color</label>
                    <label type="text" class="form-label mb-0">:&nbsp;{{ _state.form.color }}</label>
                </div>

            </div>
        </q-card-section>
    </q-card>
    <br />
    <q-card>
        <q-card-section>
            <div class="card-title flex align-items-center">
                <h6 class="flex-grow-1">
                    <span class="fa fa-file-alt"></span> {{ 'CARGAR DOCUMENTOS' }}
                </h6>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="_fnEnviarRegistros()">
                    <span class="fa fa-save"></span>&nbsp;Registrar
                </button>
            </div>
            <hr />
            <div class="row wrap">
                <FileUpload label="Documentos" multiple @get-file="files => {
                    if (files) {
                        _state.formEnviar.documentos = files
                    }
                    else { delete _state.formEnviar.documentos }
                }" />
            </div>
        </q-card-section>
    </q-card>
</template>


