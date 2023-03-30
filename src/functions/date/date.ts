
export function diffInDays(date1:Date,date2:Date) {
   const diff = date1.getTime() - date2.getTime()
   const mili = (1000 * 3600 * 24)
   return  Math.ceil(diff/mili)
}
export function addDays(date:Date, days:number) {
   date.setDate(date.getDate() + (days+1));
   return date;
 }

export function formatDate(date: number, format?: number) {
   const startDate = new Date(1971, 1, 1)//* fecha incial
   const actualDate=new Date()
   const endDate=new Date()
   let tipoFecha:'unixDate'|'unixTime'='unixDate'
   if (date.toString().length <= 9) { tipoFecha = 'unixDate' }
   else{tipoFecha='unixTime'}
   const fechaActual = actualDate.getTime()
   debugger
   const numberMilisegundos=tipoFecha=='unixDate'?(1000 * 3600 * 24):1000
   const unixFechaActual = Math.ceil(fechaActual / numberMilisegundos) 
   const diffDays = date - unixFechaActual
   const fechaBuscada = addDays(endDate, diffDays)
   let formatFecha: any = fechaBuscada
   const fullYear = fechaBuscada.getFullYear()
   let fullMonth:any=fechaBuscada.getMonth()+1
   let fullDay:any = fechaBuscada.getDate()
   if (fullMonth.toString().length == 1) fullMonth = '0' + fullMonth
   if (fullDay.toString().length == 1) fullDay = '0' + fullDay
   //*fullyear-month-day
   if (format == 1) { formatFecha = `${fullYear}-${fullMonth}-${fullDay}` }
   //*day-month-fullyear
   if (format == 2) { formatFecha = `${fullDay}-${fullMonth}-${fullYear}` }
   if (format == 3) { formatFecha = `${fullDay}/${fullMonth}/${fullYear}` }
   return formatFecha
}



