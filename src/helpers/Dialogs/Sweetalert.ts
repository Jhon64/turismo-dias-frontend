import Swal, {SweetAlertIcon} from "sweetalert2";

export const SWEETALERT = {
    Confirm: {
        show: async (text?: any, title?: string, icon?: SweetAlertIcon="warning") => {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })

            return await swalWithBootstrapButtons.fire({
                title: title || undefined,
                text: text || undefined,
                icon: icon || undefined,
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'cancelar',
                reverseButtons: true
            })
        }
    }
}