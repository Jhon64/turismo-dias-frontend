import JQuery from "jquery";
let $ = JQuery;

export default {

    async printVoucher(content: any, title:string="") {
        $("<iframe>", { name: "voucheriframe", class: "printFrame", id: "voucheriframe" })
            .appendTo("body")
            .contents()
            .find("body")
            .append(content);

            
        setTimeout(() => {
            window.document.querySelector('#title-principal').innerText = title;
            window.frames["voucheriframe"].print();
            window.document.querySelector('#title-principal').innerText = 'Trazabilidad App';
        }, 500);

        setTimeout(() => {
            $(".printFrame").remove();
        }, 1000);
    },

    printCotizacion(data: any) {
        console.log(data)
        const proyecto = data.proyecto
        // const propuestaEconomica = data.propuestaEconomica.length > 0 ? data.propuestaEconomica.sort((a:any, b:any) => {return b.id - a.id;}) : []
        const propuestaEconomica = data.propuestaEconomica
        const cliente = data.cliente
        const encargado = data.encargado
        const tipoServicio = proyecto?.tipoServicio
        const clienteAux = proyecto.cliente
        const clienteFormaPago = clienteAux ? clienteAux.clienteFormaPago : null
        const formaPago = clienteFormaPago ? clienteFormaPago.formaPago : null
        const title = `COT N° ${data.correlative}-${data.correlativeAnio} - ${data.proyecto.nombre} - ${data.cliente.razonSocial}` 
        let typeService = 0

        const nombreTipoServicio = data.tipo_cotizacion == "OPERATIVA" ? tipoServicio.nombre.toLowerCase() : data.nombreTipoServicio.toLowerCase();

        if (nombreTipoServicio == "saas") {
            typeService = 1
        } else if (nombreTipoServicio == "sw factory") {
            typeService = 2
        } else if (nombreTipoServicio == "iaas" || nombreTipoServicio == "laas") {
            typeService = 3
        } else if (nombreTipoServicio == "rhsys") {
            typeService = 4
        } else if (nombreTipoServicio == "ti" || nombreTipoServicio == 'servicios ti') {
            typeService = 5
        }

        let simboloMoneda = '$'
        let tipoMoneda = 'USD'

        if(proyecto.moneda == 'SOLES'){
            tipoMoneda = 'PEN'
            simboloMoneda = 'S/'
        }else if(proyecto.moneda == 'DOLARES'){
            tipoMoneda = 'USD'
            simboloMoneda = '$'
        }else if(proyecto.moneda == 'EUROS'){
            tipoMoneda = 'EUR'
            simboloMoneda = '€'
        }

        function formatoSoles(number:any) {
            const exp = /(\d)(?=(\d{3})+(?!\d))/g;
            const rep = '$1,';
            return number.toString().replace(exp,rep);
        }

        let propuestaEconomicaItems = ""
        let countItemsWeb = 0
        let countItemsMovil = 0
        let countItemsWebMovil = 0
        let countItemsManifiestoWebMovil = 0
        let countItemsPruebas = 0
        let countItemsServicios = 0

        let primerItem = true;

        propuestaEconomica.map((dt: any) => {
            
            if (dt.fase.nombre == "WEB" && !dt.delete) countItemsWeb = countItemsWeb + 1;
            if (dt.fase.nombre == "MOVIL" && !dt.delete) countItemsMovil = countItemsMovil + 1;
            if (dt.fase.nombre == "MANIFIESTOS, WEB Y MOVIL" && !dt.delete) countItemsManifiestoWebMovil = countItemsManifiestoWebMovil + 1;
            if ((dt.fase.nombre == "WEB Y MOVIL" || dt.fase.nombre == 'WEB Y MÓVIL') && !dt.delete) countItemsWebMovil = countItemsWebMovil + 1;
            if (dt.fase.nombre == "SERVICIOS" && !dt.delete) countItemsServicios = countItemsServicios + 1;
            if (dt.fase.nombre == "PRUEBAS" && !dt.delete) countItemsPruebas = countItemsPruebas + 1;

        })
        const totalCountItems = countItemsWeb + countItemsMovil + countItemsPruebas + countItemsManifiestoWebMovil + countItemsWebMovil + countItemsServicios

        if(proyecto.tipo_proyecto == 'OPERATIVA'){
            if (countItemsWeb > 0) {
                let countInit = 0;
                let initItemSection = true
                propuestaEconomica.map((dt: any) => {
                    if (dt.fase.nombre == "WEB" && !dt.delete) {
                        if (countInit == 0 && primerItem) {
                            // ! primer item
                            propuestaEconomicaItems = propuestaEconomicaItems + returFuntionPrimerItemGeneral(totalCountItems, countItemsWeb, dt.proyecto.nombre, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            primerItem = false
                            initItemSection = false
                            // countInit = countInit + 1;
                        }
                        if (countInit == 0 && initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFunctionPrimerItemFase(countItemsWeb, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // countInit = countInit + 1;
                            initItemSection = false
                        }
                        if (countInit != 0 && !initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFuntionItem(dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                        }
                        countInit = countInit + 1;
    
                    }
                })
            }
    
            if (countItemsMovil > 0) {
                let countInit = 0;
                let initItemSection = true
                propuestaEconomica.map((dt: any) => {
                    if (dt.fase.nombre == "MOVIL" && !dt.delete) {
                        if (countInit == 0 && primerItem) {
                            // ! primer item
                            propuestaEconomicaItems = propuestaEconomicaItems + returFuntionPrimerItemGeneral(totalCountItems, countItemsMovil, dt.proyecto.nombre, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            primerItem = false
                            initItemSection = false
                        }
    
                        if (countInit == 0 && initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFunctionPrimerItemFase(countItemsMovil, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // console.log("entreeee movil " , propuestaEconomicaItems)
                            // countInit = countInit + 1;
                            initItemSection = false
                        }
                        if (countInit != 0 && !initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFuntionItem(dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // countInit = countInit + 1;
                        }
    
                        countInit = countInit + 1;
                    }
                })
            }
    
            if (countItemsWebMovil > 0) {
                let countInit = 0;
                let initItemSection = true
                propuestaEconomica.map((dt: any) => {
                    if ((dt.fase.nombre == "WEB Y MOVIL" || dt.fase.nombre == "WEB Y MÓVIL") && !dt.delete) {
                        if (countInit == 0 && primerItem) {
                            // ! primer item
                            propuestaEconomicaItems = propuestaEconomicaItems + returFuntionPrimerItemGeneral(totalCountItems, countItemsWebMovil, dt.proyecto.nombre, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            primerItem = false
                            initItemSection = false
                        }
                        if (countInit == 0 && initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFunctionPrimerItemFase(countItemsWebMovil, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // console.log("entreeee movil " , propuestaEconomicaItems)
                            // countInit = countInit + 1;
                            initItemSection = false
                        }
                        if (countInit != 0 && !initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFuntionItem(dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // countInit = countInit + 1;
                        }
    
                        countInit = countInit + 1;
                    }
                })
            }
    
            if (countItemsManifiestoWebMovil > 0) {
                let countInit = 0;
                let initItemSection = true
                propuestaEconomica.map((dt: any) => {
                    if (dt.fase.nombre == "MANIFIESTOS, WEB Y MOVIL" && !dt.delete) {
                        if (countInit == 0 && primerItem) {
                            // ! primer item
                            propuestaEconomicaItems = propuestaEconomicaItems + returFuntionPrimerItemGeneral(totalCountItems, countItemsManifiestoWebMovil, dt.proyecto.nombre, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            primerItem = false
                            initItemSection = false
                        }
    
                        if (countInit == 0 && initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFunctionPrimerItemFase(countItemsManifiestoWebMovil, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // console.log("entreeee movil " , propuestaEconomicaItems)
                            // countInit = countInit + 1;
                            initItemSection = false
                        }
                        if (countInit != 0 && !initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFuntionItem(dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // countInit = countInit + 1;
                        }
    
                        countInit = countInit + 1;
                    }
                })
            }
    
            if (countItemsServicios > 0) {
                let countInit = 0;
                let initItemSection = true
                propuestaEconomica.map((dt: any) => {
                    if (dt.fase.nombre == "SERVICIOS" && !dt.delete) {
                        if (countInit == 0 && primerItem) {
                            // ! primer item
                            propuestaEconomicaItems = propuestaEconomicaItems + returFuntionPrimerItemGeneral(totalCountItems, countItemsServicios, dt.proyecto.nombre, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            primerItem = false
                            initItemSection = false
                        }
    
                        if (countInit == 0 && initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFunctionPrimerItemFase(countItemsServicios, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            initItemSection = false
                        }
                        if (countInit != 0 && !initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFuntionItem(dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                        }
                        countInit = countInit + 1;
                    }
                })
            }
    
            if (countItemsPruebas > 0) {
                let countInit = 0;
                let initItemSection = true
                propuestaEconomica.map((dt: any) => {
                    if (dt.fase.nombre == "PRUEBAS" && !dt.delete) {
                        if (countInit == 0 && primerItem) {
                            // ! primer item
                            propuestaEconomicaItems = propuestaEconomicaItems + returFuntionPrimerItemGeneral(totalCountItems, countItemsPruebas, dt.proyecto.nombre, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            primerItem = false
                            initItemSection = false
                            // countInit = countInit + 1;
    
                        }
                        if (countInit == 0 && initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFunctionPrimerItemFase(countItemsPruebas, dt.fase.nombre, dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                            // countInit = countInit + 1;
                            initItemSection = false
                        }
                        if (countInit != 0 && !initItemSection) {
                            propuestaEconomicaItems = propuestaEconomicaItems + returnFuntionItem(dt.actividades, dt.horasNoFacturables, dt.horasFacturables)
                        }
                        countInit = countInit + 1;
                    }
                })
            }
        }else {
            let bandPrimero = false

            let lengthPropuestaEconomica = 0;
            
            propuestaEconomica.map((dt:any)=> {
                if(!dt.delete)
                lengthPropuestaEconomica = lengthPropuestaEconomica + 1
            })

            propuestaEconomica.map((dt:any)=> {
                if(!dt.delete)
                if(!bandPrimero){
                    propuestaEconomicaItems = propuestaEconomicaItems +    `<tr class=" ">
                            <td class="bt br" rowspan="${lengthPropuestaEconomica}" style="text-align:center">1</td>
                            <td class="bt  br" rowspan="${lengthPropuestaEconomica}" colspan="2" style="text-align:center">${dt.proyecto.nombre} </td>
                            <td class="bt  br" colspan="2"> ${dt.actividades}</td>
                            <td class="bt  " style="text-align: center;">${simboloMoneda + ' '} ${formatoSoles(dt.subtotal)}</td>
                        </tr>`

                    bandPrimero = true
                }else {
                    propuestaEconomicaItems = propuestaEconomicaItems + `
                    <tr class=" ">
                        <td class="bt br" colspan="2"> ${dt.actividades}</td>
                        <td class="bt " style="text-align: center;">${simboloMoneda + ' '}  ${formatoSoles(dt.subtotal)}</td>
                    </tr>
                    `
                }

            })
        }


        function returFuntionPrimerItemGeneral(rowTotal: number, fase_total: number, nombre_proyecto: string, fase: string, actividades: string, horasNoFacturables: number, horasFacturables: number) {
            return `
            <tr class=" ">
                <td class="bt br" rowspan="${rowTotal}" style="text-align:center">1</td>
                <td class="bt  br" rowspan="${rowTotal}" style="text-align:center">${nombre_proyecto} </td>
                <td class="bt  br" style="text-align:center;" rowspan="${fase_total}">${fase}</td>
                <td class="bt  br"> ${actividades}</td>
                <td class="bt br" style="text-align: center;">${horasNoFacturables}</td>
                <td class="bt  " style="text-align: center;">${horasFacturables}</td>
            </tr>
            `;
        }

        function returnFunctionPrimerItemFase(fase_total: number, fase: string, actividades: string, horasNoFacturables: number, horasFacturables: number) {
            return `
            <tr class=" ">
                <td class="bt  br" style="text-align:center;" rowspan="${fase_total}">${fase}</td>
                <td class="bt  br"> ${actividades}</td>
                <td class="bt  br" style="text-align: center;">${horasNoFacturables}</td>
                <td class="bt  " style="text-align: center;">${horasFacturables}</td>
            </tr>
            `
        }

        function returnFuntionItem(actividades: string, horasNoFacturables: number, horasFacturables: number) {
            return `
            <tr class=" ">
                <td class="bt br"> ${actividades}</td>
                <td class="bt br" style="text-align: center;">${horasNoFacturables}</td>
                <td class="bt " style="text-align: center;">${horasFacturables}</td>
            </tr>
            `
        }

        let formaDePagoHtml = ""
        const nombreFormaDePago = formaPago ? formaPago?.nombre.toLowerCase() : ""
        if (nombreFormaDePago == "credito") {
            // <td class="bt  br bb" rowspan="2" style="width: 20%; padding: 3px 0;">${proyecto.moneda}</td>
            formaDePagoHtml = formaDePagoHtml + `
                <td class="bt  br bb" rowspan="2" style="width: 20%; padding: 3px 0; text-align:center"> ${formaPago ? formaPago.nombre : " "} ${" : "} ${clienteFormaPago ? clienteFormaPago.tiempo : " "} ${" "} ${clienteFormaPago ? clienteFormaPago.unidad : " "}</td>
            `
        } else if (nombreFormaDePago == "contado") {
            formaDePagoHtml = formaDePagoHtml + `
                <td class="bt  br bb" rowspan="2" style="width: 20%; padding: 3px 0; text-align:center">CONTADO </td>
            `
        } else {
            formaDePagoHtml = formaDePagoHtml + `
                <td class="bt  br bb" rowspan="2" style="width: 20%; padding: 3px 0; text-align:center">Crédito según acuerdo </td>
            `
        }

        let cabecera = ''
        if(proyecto.tipo_proyecto == 'OPERATIVA'){
            cabecera = `<tr class="bt">
                            <th class=" br" style="width: 6%;">ITEM</th>
                            <th class=" br" style="width: 12%;">PROYECTO</th>
                            <th class=" br" style="width: 12%;">FASE</th>
                            <th class=" br" style="width: 46%;">ACTIVIDADES</th>
                            <th class=" br" style="width: 12%;">HORAS NO FACTURABLES</th>
                            <th class=" " style="width: 12%;">HORAS FACTURABLES</th>
                        </tr>`
        }else{
            cabecera = `<tr class="bt">
                            <th class=" br" style="width: 10%;">ITEM</th>
                            <th class=" br" style="width: 20%;" colspan="2">PROYECTO</th>
                            <th class=" br" style="width: 50%;" colspan="2">ACTIVIDADES</th>
                            <th class=" " style="width: 12%;">TOTAL SIN IGV</th>
                        </tr>`
        }

        let customTotal = ''


        if(proyecto.tipo_proyecto == 'OPERATIVA'){
            customTotal = `<tr class=" " style="background-color: #5BC8A7;">
            <td class="bt  br bb" colspan="5"
                style="text-align: end; font-weight: 700;">TOTAL
                ${tipoMoneda} SIN IGV</td>
            <td class="bt   bb" style="font-weight: 700; text-align: center;">${simboloMoneda + ' '}
            ${formatoSoles(data.totalSinIGV)} </td>
        </tr>`
        }else {

            customTotal = `<tr class=" " style="background-color: #5BC8A7;">
                                <td class="bt  br bb" colspan="5"
                                    style="text-align: end; font-weight: 700;">TOTAL
                                    ${tipoMoneda} SIN IGV</td>
                                <td class="bt   bb" style="font-weight: 700; text-align: center;">${simboloMoneda + ' '}
                                ${formatoSoles(data.subtotal)} </td>
                            </tr>`
        }


        const styleAux = `
      <style type="text/css" media="screen, print">
    
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
    
        .thin {
            /* Montserrat Thin = 100 */
            font-weight: 100;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        .extralight {
            /* Montserrat Extra Light = 200 */
            font-weight: 200;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .light {
            /* Montserrat Light = 300 */
            font-weight: 300;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .regular {
            /* Montserrat Regular = 400 */
            font-weight: 400;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .medium {
            /* Montserrat Medium = 500 */
            font-weight: 500;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .semibold {
            /* Montserrat Semi-bold = 600 */
            font-weight: 600;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .bold {
            /* Montserrat Bold = 700 */
            font-weight: 700;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .extrabold {
            /* Montserrat Extra Bold = 800 */
            font-weight: 800;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
        
        
        .black {
            /* Montserrat Black = 900 */
            font-weight: 900;
            font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
        }
    
        body {
            margin: 0cm 0cm;
            font-size: 12px;
            font-family: 'Open Sans', sans-serif;
        }
    
      /* Styles go here */
    
    .page-header, .page-header-space {
      height: 50px;
      display: block;

    }
    
    .page-footer, .page-footer-space {
      height: 50px;
      display: block;
      
    }
    
    .cabecera {
        display: flex;
        height: 80px;
        width: 100%;
    }
    
    .nameInfo {
        color: black;
        font-weight: bold;
    }
    
    .answerInfo {
          color: #616161;
          font-weight: 500;
          padding-Left:4px;
    }
    
    .table-cabecera-name {
      width:33%;  
      text-align: start;
      text-decoration: underline;
      padding: 5px 0 15px 0;
      font-weight: 700;
      font-size: 16px;
    
    }
    
    .page-footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      border-top: 1px solid black; /* for demo */
    }
    
    .page-header {
      position: fixed;
      width: 100%;
    }
    
    .tr-analisis {
        color: #000000;
        padding: 5px 0;
    }
    
    .tr-sub-analisis {
        color: #000000;
    }
    
    .underlined-row {
        background-color: #F8F8F8;
    }
    
    .custom-section {
      padding: 20px 50px 0px 50px;
    }
    
    .name-analisis {
      text-decoration: underline;
      font-weight: 700;
      font-size:14px;
      text-transform: uppercase;
    }
    
    .name-sub-analisis {
        
        text-transform: uppercase;
    }
    
    .table-answer-tr {
        padding: 0 0 0 5px;
        font-size: 15px;
    }
    

    .salto {
        page-break-after: always;
        page-break-before: always;
        
      }    

    .page {
      page-break-after: always;
      page-break-before: always;
      
    }
    
    @page {
      margin: 20mm 10mm 10mm 10mm;
      page-break-after: always;
      page-break-before: always;
    }
    
    footer {
        position: fixed;
        bottom: 10px;
        width: 100%;
      }
    
    @media print {
       thead {display: table-header-group;} 
       tfoot {display: table-footer-group;}
       
       button {display: none;}
       
       body {margin: 0;}
       page-break-before: always;
    } 
    .label-name{
        font-weight: 700;
    }

    .bl {
        border-left: 1px solid black; 
    }

    .bt {
        border-top: 1px solid black; 
    }
    
    .br {
        border-right: 1px solid black; 
    }
    
    .bb {
        border-bottom: 1px solid black; 
    }

    

    .pt-2{
        padding-top:2px;
    }
    .pt-4{
        padding-top:4px;
    }
    .pt-6{
        padding-top:6px;
    }
    
    .pr-2{
        padding-right:2px;
    }
    .pr-4{
        padding-right:4px;
    }
    .pr-6{
        padding-right:6px;
    }

    .pl-2{
        padding-left:2px;
    }
    .pl-4{
        padding-left:4px;
    }
    .pl-6{
        padding-left:6px;
    }

    .pb-2{
        padding-bottom:2px;
    }
    .pb-4{
        padding-bottom:4px;
    }
    .pb-6{
        padding-bottom:6px;
    }

    </style>
    `;



        const section03 = `
    

<tr>
    <td style="padding: 0 70px 0 70px;">
        <section class="bl br bt ">
            <div style="display: flex; width: 100%; ">
                <div style="display: flex; width: 25%; justify-content: center;  align-items: center; ">
                    <img src="https://www.yawi.pe/assets/images/logo-yawi.svg" alt="" style="width: 77%; margin-top: 16px; ">
                </div>
                <div style="display: flex; flex-direction: column; width: 50%; align-items: center;">
                    <div style="margin-top: 14px;">
                        <label for="" style="font-weight: 700; font-size: 17px;">COTIZACIÓN DE SERVICIOS</label>
                    </div>
                    <div style="display: flex; width: 100%;">
                        <div style="display: flex; width: 15%;">
                            <img src="/assets/media-pdf/iso9001.png" alt="" style="width: 41px; height:36px; margin-top: 3px;">
                        </div>
                        <div style="display: flex; width: 30%; ">
                            <img src="/assets/media-pdf/aws.png" alt="" style="width: 90px; height:35px; margin-top: 6px;">
                        </div>
                        <div style="display: flex; width: 30%;">
                            <img src="/assets/media-pdf/registered.pmg.png" alt="" style="width: 90px; height:35px; margin-top: 3.8px;">
                        </div>
                        <div style="display: flex; width: 24%;">
                            <img src="/assets/media-pdf/image17.jpeg" alt="" style="width: 100%; margin-top: 5px;">
                        </div>
                    </div>
                </div>
                <div style="width: 25%; display: flex; flex-direction: column; padding-top: 5px;">
                    <div style="display: flex; justify-content: center; padding: 2px 0;" class="bt bl ">
                        <label for="">RUC: </label>
                        <label for="">20604094365 </label>
                    </div>
                    <div style="display: flex; justify-content: center; background-color: #AAAAAA;  padding: 2px 0;"
                        class="bt bl bb">
                        <label for="" style="font-weight: 900;">COTIZACIÓN</label>
                    </div>
                    <div style="display: flex; justify-content: center; padding: 2px 0;" class=" bl bb">
                        <label for="">N° ${data.correlative}-${data.correlativeAnio}</label>
                    </div>
                </div>
            </div>

            <div
                style="display: flex; justify-content: end; width: 100%;  padding-bottom: 3px;">
                <div style="display: flex; align-items: center;">
                    <label for="" class="label-name">FECHA COTIZACION: </label>
                    <label for="" style="  padding: 0 6px; margin-left: 30px;" class="bt bl bb"> 
                    ${new Date(data.createdAt).getDate() + "-" +
            (new Date(data.createdAt).getMonth() + 1) + "-" +
            new Date(data.createdAt).getFullYear()}
                   </label>
                </div>
            </div>
        </section>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <section class="bl br bt">
            <div
                style="display:flex; width: 100%; background-color: #555555; padding: 4px 0; justify-content: center;">
                <label for="" style="color: white; font-weight: 700;">DATOS DEL CLIENTE</label>
            </div>
            <div style="display:flex; width: 100%;">
                <div style="display:flex; width: 70%;">
                    <div style="width: 25%;  " class="br pt-2 pb-2 pl-2">
                        <label for="" class="label-name">RAZON SOCIAL: </label>
                    </div>
                    <div style="width: 75%; margin-left: 5px;" class=" pt-2 pb-2">
                        <label for="" class="label-name">${cliente.razonSocial} </label>
                    </div>
                </div>
                <div style="display:flex; width: 30%; ">
                    <div class="bl br pt-2 pb-2  pl-2" style="width: 30%;">
                        <label for="" class="label-name">RUC: </label>
                    </div>
                    <div style="width: 70%; margin-left: 5px;" class=" pt-2 pb-2 pl-2">
                        <label for="" class="label-name">${cliente.ruc}</label>
                    </div>
                </div>
            </div>
            <div style="display:flex; width: 100%;">
                <div style="display:flex; width: 70%;" class="bt bb">
                    <div style="width: 25%;  "  class="br pt-2 pb-2 pl-2">
                        <label for="" class="label-name">ATENCIÓN: </label>
                    </div>
                    <div style="width: 75%; margin-left: 5px;" class=" pt-2 pb-2">
                        <label for="" class="label-name">${proyecto.cliente?.contacto}</label>
                    </div>
                </div>
                <div style="display:flex; width: 30%; " class="bt bb">
                    <div class="bl br pt-2 pb-2 pl-2" style="width: 30%;" >
                        <label for="" class="label-name">CARGO: </label>
                    </div>
                    <div style="width: 70%; margin-left: 5px;" class=" pt-2 pb-2">
                        <label for="" class="label-name">${proyecto.cliente?.cargo}</label>
                    </div>
                </div>
            </div>
            <br>
        </section>
    </td>
</tr>


<tr>
    <td style="padding: 0 70px 0 70px;">
        <section class="bl br ">
            <div style="display:flex; width: 100%; background-color: #555555; padding: 4px 0; justify-content: center;">
                <label for="" style="color: white; font-weight: 700;">DETALLE DEL SERVICIO</label>
            </div>
            <div style="display:flex; width: 100%;" class="bt">
                <div style="width: 30%;  " class="br bb pt-2 pb-2 pl-2">
                    <label for="" class="label-name">NOMBRE DEL PROYECTO: </label>
                </div>
                <div style="width: 70%; text-align: center;" class="bb pt-2 pb-2">
                    <label for="" class="label-name">${proyecto.nombre} </label>
                </div>
            </div>
            <div class="bb"
                style="display: flex; align-items: center; padding: 5px 0; justify-content: space-around;">
                <div style="display: flex; justify-content: center; align-items: center;">
                    <label for="">SaaS</label>
                    ${typeService == 1 ? '<label for="" class="bt bb bl br" style="padding: 0 15px; margin-left: 4px; font-size:9px;">✔</label>' : '<label for="" class="bt bb bl br" style="padding: 6px 25px; margin-left: 4px;"></label>'}
                </div>
                <div style="display: flex; justify-content: center; align-items: center;">
                    <label for="">SW Factory</label>
                    ${typeService == 2 ? '<label for="" class="bt bb bl br" style="padding: 0 15px; margin-left: 4px; font-size:9px;">✔</label>' : '<label for="" class="bt bb bl br" style="padding: 6px 25px; margin-left: 4px;"></label>'}
                </div>
                <div style="display: flex; justify-content: center; align-items: center;">
                    <label for="">Iaas</label>
                    ${typeService == 3 ? '<label for="" class="bt bb bl br" style="padding: 0 15px; margin-left: 4px; font-size:9px;">✔</label>' : '<label for="" class="bt bb bl br" style="padding: 6px 25px; margin-left: 4px;"></label>'}
                </div>
                <div style="display: flex; justify-content: center; align-items: center;">
                    <label for="">RHSYS</label>
                    ${typeService == 4 ? '<label for="" class="bt bb bl br" style="padding: 0 15px; margin-left: 4px; font-size:9px;">✔</label>' : '<label for="" class="bt bb bl br" style="padding: 6px 25px; margin-left: 4px;"></label>'}
                </div>
                <div style="display: flex; justify-content: center; align-items: center;">
                    <label for="">TI</label>
                    ${typeService == 5 ? '<label for="" class="bt bb bl br" style="padding: 0 15px; margin-left: 4px; font-size:9px;">✔</label>' : '<label for="" class="bt bb bl br" style="padding: 6px 25px; margin-left: 4px;"></label>'}
                </div>
            </div>
            <br>
        </section>
    </td>
</tr>


<tr>
    <td style="padding: 0 70px 0 70px;">
        
        <div class="bl br bt bb" >
            <label for=""
                style="display:flex; justify-content: center; width: 100%; background-color: #7AC85B; font-weight: 700; padding: 5px 0;">PROPUESTA
                ECONÓMICA</label>
        </div>
        
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <table style="width: 100%;  border-spacing: 0 !important; font-size: 7px;">
                <thead>
                    ${cabecera}
                </thead>
                <tbody>
                    ${propuestaEconomicaItems}

                    ${proyecto.tipo_proyecto == 'OPERATIVA' ? `<tr class=" ">
                    <td class="bt  br" colspan="5"
                        style="text-align: end; font-weight: 700;">TOTAL
                        HORAS FACTURABLES</td>
                    <td class="bt  " style="font-weight: 700; text-align: center;">
                    ${data.totalHorasFacturables}  </td>
                </tr>` : ``}
                    
                ${proyecto.tipo_proyecto == 'OPERATIVA' ? `<tr class=" ">
                    <td class="bt  br" colspan="5"
                        style="text-align: end; font-weight: 700;">SUBTOTAL
                    </td>
                    <td class="bt  " style="font-weight: 700; text-align: center;">${simboloMoneda + ' '}
                    ${formatoSoles(data.subtotal)}
                    </td>
                </tr>
                <tr class=" " style="background-color: #7AC85B;">
                    <td class="bt  br" colspan="5"
                        style="text-align: end; font-weight: 700;">DCTO</td>
                    <td class="bt  " style="font-weight: 700; text-align: center;">${simboloMoneda + ' '}
                    ${formatoSoles(data.descuento)}
                    </td>
                </tr>` : `` } 

                ${customTotal}

                
                    



                </tbody>
            </table>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div style="padding: 7px 0;" ></div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bt bl br">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">ESPECIFICACIONES</label>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div style="display:flex; ">
            <label class=" bt br bl" style="width: 25%; text-align: center; padding: 3px 0;">1. Duración del
                servicio</label>
            <label class="bt br" style="width: 25%; text-align: center; padding: 3px 0;">2. Equipo</label>
            <label class="bt br" style="width: 15%; text-align: center; padding: 3px 0;">3. Validez de la oferta</label>
            <label class="bt br" style="width: 20%; text-align: center; padding: 3px 0;">4. Forma de pago</label>
            <label class="bt br" style="width: 15%; text-align: center; padding: 3px 0;">5. Moneda</label>
        </div>
        
    </td>
</tr>


<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <table style="width: 100%;  border-spacing: 0 !important; font-size: 7px;">
            <tbody>
                <tr class=" ">
                    <td class="bt  br bl" style="width: 25%; padding: 3px 0;">Fecha inicio (estimada): Por definir</td>
                    <td class="bt  br " style="width: 25%; padding: 3px 0;">Responsable: YAWI </td>
                    <td class="bt  br bb" rowspan="2" style="text-align:center; width: 15%;">5 días
                    </td>
                    ${formaDePagoHtml}
                    
                    <td class="bt  bb br" rowspan="2" style="text-align:center; width: 15%; padding: 3px 0;">
                    ${proyecto.moneda}
                    </td>
                </tr>
                <tr class=" ">
                    <td class="bt  br bb bl" style="width: 25%;">Fecha fin (estimada): Por definir</td>
                    <td class="bt  br bb " style="width: 25%;">Responsable: YAWI </td>
                </tr>
            </tbody>
        </table>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div style="padding: 7px 0;" ></div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bt bl br bb">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">CONSIDERACIONES
                DEL SERVICIO</label>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <table  style="width: 100%;  border-spacing: 0 !important; font-size: 7px;">
                <tbody >
                    <tr>
                        <td style="width: 40%" rowspan="5">
                        <div style="display:flex; justify-content:center; width: 100%; padding: 3px 0;">
                                <img src="/assets/media-pdf/image3.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 60%;">* YAWI entregará un alcance funcional sobre la
                            especificación
                            del requerimiento, será aprobado por el Cliente previo al inicio del servicio.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            * Se definirán reuniones periódicas para revisar los avances y cambios no
                            funcionales con el Cliente.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            * YAWI, asegurará la CALIDAD en cada fase del servicio realizado a nivel de la
                            funcionalidad desarrollada. Probando INPUTs y Reportes del desarrollo actual o
                            existentes.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            * El Cliente deberá participar de las capacitaciones según programación de ser
                            el
                            caso.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Se definirán reuniones periódicas para revisar los avances y cambios no
                            funcionales
                            con el Cliente.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>



${data.observacion_importante? 
    `
<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bt bl br bb">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">IMPORTANTE</label>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div  style="padding-top: 7px; font-size: 8px; padding-left: 6px; padding-bottom: 7px;">
                <label for="" style="">${data.observacion_importante }</label>
            </div>
        </div>
    </td>
</tr> ` 
    : ""}



<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bt bl br bb">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">DETALLE
                DE INFRAESTRUCTURA Y SOPORTE DEL SERVICIO
                DEL SERVICIO</label>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div  style="padding-top: 10px; font-size: 8px; padding-left: 10px;">
                <label for="" style="font-weight: 700;">1. SLA y Soporte de Incidencias. Detalle</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div  style="padding-top: 4px; font-size: 8px;  padding-left: 10px;">
                <label for="">a. Detalle</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div  style="padding: 0 110px;">
                <table style=" border-spacing: 0px !important; font-size: 8px; ">
                    <thead>
                        <tr style=" background-color: black; color:white;">
                            <th class="bl br" style="width: 33%; padding: 2px 0;">TIPO DE INCIDENCIA
                            </th>
                            <th class="bl br" style="width: 33%;">DETALLE</th>
                            <th class="bl br" style="width: 33%;">TIEMPO DE RESPUESTA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="bl br bb" style="text-align: center;">Critico</td>
                            <td class="  bb" style="text-align: center;">Incidente que detenga la
                                operación, tenga
                                efecto económico sobre la compañía y no exista workaround.</td>
                            <td class="bl br bb" style="text-align: center;">2 horas</td>
                        </tr>
                        <tr>
                            <td class="bl br bb" style="text-align: center;">No crítico</td>
                            <td class="  bb" style="text-align: center;">Incidente que no detenga la
                                operación, que
                                no tenga efecto económico sobra la compañía o exista workaround.
                            </td>
                            <td class="bl br bb" style="text-align: center;">8 horas</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px; ">
        <div class="bl br" >
            <div style="padding-top: 4px;  padding-left: 10px;">
                <label for="">
                    * Mejoras solicitadas y aprobadas por el cliente tendrán un costo por hora de
                    desarrollo.</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br" >
            <div style="padding-top: 4px;  padding-left: 10px;">
                <label for=""> * Corrección de errores cubierto dentro del servicio a partir de la salida a
                    productivo</label>
            </div>
        </div>
    </td>
</tr>


<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br">
            <div  style="padding-top: 10px;  padding-left: 10px;">
                <label for="" style="font-weight: 700;">VPN</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br">
            <div  style="padding-top: 4px;  padding-left: 10px;">
                <label for="">* El servicio incluye VPN dedicada e ilimitada con nuestra nube AWS.</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br">
            <div  style="padding-top: 10px;  padding-left: 10px;">
                <label for="" style="font-weight: 700;">2. Mesa de Soporte</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br">
            <div  style="padding-top: 4px;  padding-left: 10px;">
                <label for="">* Soporte de tickets y atención a usuarios mediante el portal de soporte
                    ingresando a https://soporte.yawi.pe y mesa de ayuda de YAPU dentro del horario de
                    atención es de Lunes a Viernes de 8 am a 1 pm y de 3 pm a 6 pm, Sabados 9 am a 1 pm.</label>
            </div>
        </div>
    </td>
</tr>


<tr>
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br">
            <div  style="padding-top: 4px; padding-left: 10px;">
                * De requerirse soporte fuera de este horario se debe comunicar con un mínimo de
                anticipación de 24 horas.
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px; ">
        <div class="bt bl br">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">CONDICIONES
                DE PAGO</label>
        </div>
    </td>
</tr>

<tr >
    <td style="padding: 0 70px 0 70px; font-size: 8px;">
        <div class="bl br" >
            <div style="font-weight: 700; padding: 5px 0;">
                * El monto esta expresado en Dolares Americanos ($) y No incluyen IGV
            </div>
        </div>
    </td>
</tr>

<tr>
    <td  style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div  style="padding: 0 60px; padding-bottom: 10px;">
                <table  style="width: 100%; border-spacing: 0px !important; font-size: 8px;">
                    <thead>
                        <tr>
                            <th style="width: 33%;"></th>
                            <th style="width: 33%;"></th>
                            <th style="width: 33%;"></th>
                        </tr>
                    </thead>
                    <tbody style="font-size: 8px;">
                        <tr>
                            <td colspan="3" style="background-color: black; color:white; padding: 2px 0;">
                                CUENTA
                                CORRIENTE</td>
                        </tr>
                        <tr>
                            <td class="bl br bb" style="text-align: center;">BCP SOLES</td>
                            <td class=" br bb" style="text-align: center;">570-2530382-0-88</td>
                            <td class=" br bb" style="text-align: center;">CCI: 002-570002530382088-07
                            </td>
                        </tr>
                        <tr>
                            <td class="bl br bb" style="text-align: center;">BCP DOLARES</td>
                            <td class=" br bb" style="text-align: center;">570-2441789-1-18</td>
                            <td class=" br bb" style="text-align: center;">CCI: 002-570002441789118-01
                            </td>
                        </tr>
                        <tr>
                            <td class="bl br bb" style="text-align: center;">BNA SOLES</td>
                            <td class=" br bb" style="text-align: center;">00-771-046215</td>
                            <td class=" br bb" style="text-align: center;"></td>
                        </tr>

                        

                    </tbody>
                </table>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bt bl br">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">INFORMACIÓN
                CORPORATIVA</label>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br">
            <div  style="padding: 10px 0; font-size: 8px;">
                <label for="">Empresa de tecnología dedicada al desarrollo de software para el soporte de la
                    gestión y control de operaciones agrícolas</label>
            </div>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bt bl br">
            <label for="" 
                style="display:flex; justify-content: center; background-color: #555555; color: white;  font-weight: 700;  padding:5px 0; font-size: 8px;">CLIENTES</label>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="br bl">
            <table style=" border-spacing: 0px !important; font-size: 8px; width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image18.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style=" width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image8.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image21.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image9.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="br bl">
            <table style=" border-spacing: 0px !important; font-size: 8px; width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image31.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style=" width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image7.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image6.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image4.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="br bl">
            <table style=" border-spacing: 0px !important; font-size: 8px; width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image8.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style=" width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image23.jpeg" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image32.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image27.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="br bl">
            <table style=" border-spacing: 0px !important; font-size: 8px; width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image22.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style=" width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image30.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image20.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image26.jpeg" alt="" style="width: 60%;">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="br bl bb">
            <table style=" border-spacing: 0px !important; font-size: 8px; width: 100%;">
                <tbody>
                    <tr>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image25.jpeg" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style=" width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image29.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image28.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                        <td style="width: 25%">
                            <div style="display:flex; justify-content:center; width: 100%">
                                <img src="/assets/media-pdf/image24_1.png" alt="" style="width: 60%;">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </td>
</tr>

<tr>
    <td style="padding: 0 70px 0 70px;">
        <div class="bl br ">
            <div  style="padding: 10px 0; font-size: 8px; padding-left: 5px;">
                De presentarse alguna consulta, dirigirlas al email o al teléfono proporcionado del
                representante de esta cotización.
            </div>
        </div>
    </td>
</tr>

<tr >
    <td style="padding: 0 70px 0 70px;" >
        <div class="bl br bb" style="display:flex; padding-left: 30px; padding-bottom: 15px; ">
            <table style=" border-spacing: 0px !important; font-size: 8px; width: 60%; padding-top: 20px;">
                <tbody style=" border-spacing: 0px !important; font-size: 8px;">
                    <tr>
                        <td style="width: 50%; text-align: right; padding: 3px 0;" class="bl br bt">
                            Cotizado por:
                        </td>
                        <td style="width: 50%; text-align: center;" class=" br bt">
                            Jerlin Llaro Abanto
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 50%; text-align: right; padding: 3px 0;" class="bl br bt">
                            Teléfono:
                        </td>
                        <td style="width: 50%; text-align: center;" class=" br bt">
                            +51 934580013                        
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 50%; text-align: right; padding: 3px 0;" class="bl br bt" >
                            Correo electrónico:
                        </td>
                        <td style="width: 50%; text-align: center;" class=" br bt">
                            jllaro@yawi.pe
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class=" br bt bb bl" style=" padding: 3px 0; text-align: center;">www.yawi.pe</td>
                    </tr>
                </tbody>
            </table>
            <div style="display:flex; justify-content:center; width: 40%">
                <img src="/assets/media-pdf/image15.jpeg" alt="" style="width: 60%;">
            </div>
        </div>
    </td>
</tr>




    `;

        const footer = `
    <footer >
        
    </footer>`;

        this.printVoucher(
            `<head>
    </head>` +
            styleAux +
            `<body>

      <div class="page-header">
        <header >
          
        </header>
      </div>

      <table style=" width:100%; border-spacing: 0 !important;" >

        <thead>
          <tr>
            <td>
              <div class="page-header-space"></div>
            </td>
          </tr>
        </thead>

        <tbody style="border-spacing: 0 !important; font-size:8px;">
            ${section03}
        </tbody>

        <tfoot>
          <tr>
            <td>
              <div class="page-footer-space">
                ${footer}
              </div>
            </td>
          </tr>
        </tfoot>

      </table>
    </body>
    
    `, title
        );


    },
}


// ! info bancos

// <tr>
//                             <td colspan="3" style="background-color: black; color:white; padding: 1px 0;">
//                                 <label>OPERACIÓN SUJETA A DETRACCIÓN</label>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td colspan="3" style="background-color: black; color:white; padding: 1px 0;">
//                                 SPOT
//                             </td>
//                         </tr>
//                         <tr>
//                             <td class="bl br bb" style="text-align: center;">BANCO</td>
//                             <td class=" br bb" style="text-align: center;">BANCO DE LA NACIÓN</td>
//                             <td class=" br bb" style="text-align: center;">CCI: 002 570 002530382088 07
//                             </td>
//                         </tr>
//                         <tr>
//                             <td class="bl br bb" style="text-align: center;">N° CUENTA</td>
//                             <td class=" br bb" style="text-align: center;">00 - 771 - 046215</td>
//                             <td class=" br bb" style="text-align: center;">CCI: 002 570 002530382088 07
//                             </td>
//                         </tr>