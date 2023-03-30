import * as Excel from "exceljs";
import * as fs from "file-saver";

export default {
    downloadExcelProyecto(data: any) {
    
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");
        worksheet.columns = [
            // { header: "NOMBRE", key: "name", width: 30, style: { font: { vertAlign: 'Arial Black' } } },
            { header: "N° COTIZACION", key: "numero_cotizacion", width: 15 },
            { header: "NOMBRE", key: "name", width: 30 },
            { header: "FECHA", key: "date", width: 13 },
            { header: "CLIENTE ", key: "clienteRazonSocial", width: 33 },
            { header: "RUC ", key: "clienteRuc", width: 15 },
            { header: "PAIS ", key: "pais", width: 15 },
            { header: "CONTACTO CLIENTE", key: "responsable", width: 27 },
            { header: "RESPONSABLE", key: "responsableProyecto", width: 27 },
            { header: "TIPO", key: "tipo", width: 15 },
            { header: "TIPO SERVICIO", key: "tipo_servicio", width: 15 },
            { header: "ESTADO", key: "estado", width: 27 },
            { header: "MONEDA", key: "moneda", width: 15 },
            { header: "COSTO HORA", key: "costoHora", width: 15 },
            { header: "TOTAL HORA", key: "totalHora", width: 15 },
            { header: "SUBTOTAL", key: "subTotal", width: 15 },
            { header: "ESTADO PROYECTO", key: "estado_proyecto", width: 18 },
            { header: "FECHA FACTURACION", key: "date_facturacion", width: 23 },
            { header: "ESTADO FACTURACION", key: "status_facturacion", width: 23 },
            { header: "ESTADO DEUDA", key: "estadoDebts", width: 20 },
            { header: "COMENTARIO", key: "comment", width: 30}
        ];
    
        const abcRow = ['A', 'B','C', 'D','E', 'F','G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T']
        abcRow.map((abc:any)=> {
            worksheet.getCell(`${abc}1`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "FF00D1FF"
                },
                bgColor: {
                    argb: "FF00D1FF"
                },
            }
            worksheet.getCell(`${abc}1`).font = {
                name: 'Calibri',
                color: { argb: 'FFFFFFFF' },
                size: 14,
            };

            worksheet.getCell(`${abc}1`).border = {
                top: {style:'thin', color: {argb:'FF000000'}},
                left: {style:'thin', color: {argb:'FF000000'}},
                bottom: {style:'thin', color: {argb:'FF000000'}},
                right: {style:'thin', color: {argb:'FF000000'}}
              };
        })
        
        const estadoProyecto = [
            {id:1, name:"REGISTRADO"},
            {id:2, name:"EN CURSO - SIN OC / SIN COS"},
            {id:3, name:"EN CURSO"},
            {id:4, name:"CERRADO - SIN OC / SIN COS"},
            {id:5, name:"CERRADO - CON OC / SIN COS"},
            {id:6, name:"CERRADO"},
            {id:7, name:"CANCELADO"},
        ]

        function formatoSoles(number:any) {
            const exp = /(\d)(?=(\d{3})+(?!\d))/g;
            const rep = '$1,';
            return number.toString().replace(exp,rep);
        }

        const formatearFecha = (date:Date)=> {
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }

        let row = 2

        data.map((dt:any)=> {

            let estadoName:any = ""
            let numeroCotizacion = "-"
            let simboloMoneda = '$'

            if(dt.moneda == 'SOLES'){
                simboloMoneda = 'S/'
            }else if(dt.moneda == 'DOLARES'){
                simboloMoneda = '$'
            }else if(dt.moneda == 'EUROS'){
                simboloMoneda = '€'
            }

            let status_facturacion = "-"
            let estado_proyecto = ""
            let estadoDebts = "-"
            let date_facturacion = ""

            if(dt.cotizaciones.length > 0){
                const cotizacion = dt.cotizaciones[0]
                if(cotizacion){
                    numeroCotizacion = cotizacion.correlative + ' - ' + cotizacion.correlativeAnio
                    if(cotizacion.facturacion){
                        status_facturacion = cotizacion.facturacion.status_facturacion  == 2 ? "FACTURADO" : "PENDIENTE"

                    }
                    const facturacionAux = cotizacion?.facturacion
                    if(facturacionAux){
                        date_facturacion = formatearFecha(new Date(facturacionAux.createdAt))
                    }
                    const debsFacturacion = facturacionAux?.debsFacturacion
                    if(debsFacturacion){
                        estadoDebts = debsFacturacion.status_debt == 1 ? "PENDIENTE" : "PAGADO"
                    }
                }
            }
            
            if(dt.estado_proyecto){
             estadoName = estadoProyecto.find((ep:any)=> ep.id == dt.estado_proyecto)?.name
            }

            if(dt.estado_proyecto == 1){
                estado_proyecto = "REGISTRADO"
            }else if(dt.estado_proyecto == 2 || dt.estado_proyecto == 3){
                estado_proyecto = "EN CURSO"
            }else if(dt.estado_proyecto== 4 || dt.estado_proyecto== 5 || dt.estado_proyecto== 6){
                estado_proyecto = "CERRADO"
            }else if(dt.estado_proyecto== 7){
                estado_proyecto = "CANCELADO"
            }

            worksheet.addRow({
                numero_cotizacion: numeroCotizacion,
                name: dt.nombre, 
                date: dt.fecha, 
                clienteRazonSocial: dt.clienteRazonSocial,
                clienteRuc: dt.clienteRuc,
                responsable: dt.responsable, 
                tipo: dt.tipo_proyecto,
                estado: estadoName,
                moneda: dt.moneda,
                costoHora: formatoSoles(dt.tarifaHora),
                totalHora: dt.totalHoras,
                subTotal: formatoSoles(dt.subtotal),
                estado_proyecto,
                status_facturacion,
                tipo_servicio: dt.tipoServicio.nombre,
                pais: dt.pais ? dt.pais.name : "",
                responsableProyecto: dt.responsableProyecto,
                estadoDebts,
                date_facturacion,
                comment: dt.comment
            });

            worksheet.getCell(`I${row}`).alignment = {
                horizontal: 'center'
              };

            worksheet.getCell(`J${row}`).alignment = {
                horizontal: 'center'
            };
            worksheet.getCell(`K${row}`).alignment = {
                horizontal: 'center'
            };

            abcRow.map((abc:any)=> {
    
                worksheet.getCell(`${abc} ${row}`).border = {
                    top: {style:'thin', color: {argb:'FF000000'}},
                    left: {style:'thin', color: {argb:'FF000000'}},
                    bottom: {style:'thin', color: {argb:'FF000000'}},
                    right: {style:'thin', color: {argb:'FF000000'}}
                  };
            })
            row = row  + 1
        })

        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            fs.saveAs(blob, `ReporteProyecto_${Date.now()}.xlsx`);
        });

    },

    downloadExcelCliente(data:any){
        
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("My Sheet");
        worksheet.columns = [
            { header: "RAZON SOCIAL", key: "razon_social", width: 30 },
            { header: "RUC", key: "ruc", width: 15 },
            { header: "DIRECCION", key: "direccion", width: 35 },
            { header: "TELEFONO", key: "telefono", width: 18 },
            { header: "PAIS ", key: "pais", width: 15 },
            { header: "CONTACTO", key: "contacto", width: 27 },
            { header: "CARGO", key: "cargo", width: 20 },
            { header: "FORMA DE PAGO", key: "forma_pago", width: 20 },
            { header: "MONEDA", key: "moneda", width: 15 },
            { header: "TARIFA NORMAL", key: "tarifario", width: 20 },
            { header: "TARIFA DESCUENTO", key: "tarifarioDescuento", width: 24 }
        ];
    
        const abcRow = ['A', 'B','C', 'D','E', 'F','G', 'H','I', 'J', 'K']
        abcRow.map((abc:any)=> {
            worksheet.getCell(`${abc}1`).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "FF00D1FF"
                },
                bgColor: {
                    argb: "FF00D1FF"
                },
            }
            worksheet.getCell(`${abc}1`).font = {
                name: 'Calibri',
                color: { argb: 'FFFFFFFF' },
                size: 14,
            };

            worksheet.getCell(`${abc}1`).border = {
                top: {style:'thin', color: {argb:'FF000000'}},
                left: {style:'thin', color: {argb:'FF000000'}},
                bottom: {style:'thin', color: {argb:'FF000000'}},
                right: {style:'thin', color: {argb:'FF000000'}}
              };
        })
        
        let row = 2

        

        data.map((dt:any)=> {
           
            const clienteFormaPago = dt.clienteFormaPago.length > 0 ?  dt.clienteFormaPago[0] : null
            const clienteMoneda = dt.clienteMoneda.length > 0 ? dt?.clienteMoneda[0] : null
            let forma_pago = ""
            if(clienteFormaPago.formaPagoNombre == 'CONTADO'){
                forma_pago = `${clienteFormaPago ? clienteFormaPago.formaPagoNombre : ""} `  
            }else {
                forma_pago = `${clienteFormaPago ? clienteFormaPago.formaPagoNombre : ""} - ${clienteFormaPago.tiempo} - ${clienteFormaPago.unidad}`  
            }

            worksheet.addRow({
                razon_social: dt.razonSocial,
                ruc: dt.ruc, 
                direccion: dt.direccion,
                telefono: dt.telefono,
                pais: dt.paisName, 
                contacto: dt.contacto ? dt.contacto : '-',
                cargo: dt.cargo ? dt.cargo : '-',
                forma_pago,
                moneda: clienteMoneda ? clienteMoneda?.nombre : "-",
                tarifario: dt.tarifaHora ,
                tarifarioDescuento: dt.tarifaHoraDescuento 
            });

            worksheet.getCell(`I${row}`).alignment = {
                horizontal: 'center'
              };

            worksheet.getCell(`J${row}`).alignment = {
                horizontal: 'center'
            };
            worksheet.getCell(`K${row}`).alignment = {
                horizontal: 'center'
            };

            abcRow.map((abc:any)=> {
    
                worksheet.getCell(`${abc} ${row}`).border = {
                    top: {style:'thin', color: {argb:'FF000000'}},
                    left: {style:'thin', color: {argb:'FF000000'}},
                    bottom: {style:'thin', color: {argb:'FF000000'}},
                    right: {style:'thin', color: {argb:'FF000000'}}
                  };
            })
            row = row  + 1
        })

        workbook.xlsx.writeBuffer().then((data: any) => {
            const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            fs.saveAs(blob, `ReporteCliente_${Date.now()}.xlsx`);
        });

    }

}