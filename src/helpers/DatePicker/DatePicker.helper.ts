import * as  datepicker from 'js-datepicker'
import * as moment from 'moment'

export const DatePickerHelper = {
    onSelect:(instance:any)=>{return DatePickerHelper.Instancia},
    configuracion: (config?:object) => {
        return {
            dateSelected: new Date(),
            customDays: ['Dom', 'Lun', 'Mar', 'Mie', 'Juev', 'Vie', 'Sab'],
            customMonths: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            formatter: (input:any, date:any, instance:any) => {
                const value = date.toLocaleDateString()
                input.value = value // => '1/1/2099'
            },
            // onSelect: (instance: any) => {
            //    DatePickerHelper.onSelect(instance)          
            // },
            ...config
        }
    },
    Instancia: (selector: any,config?:object) => {
        const picker = datepicker(selector,
            DatePickerHelper.configuracion(config))
        return picker
    }
}