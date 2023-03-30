<script  setup lang="ts">
import { formatDate } from '@/functions/date/date';
import { DatePickerHelper } from '@/helpers/DatePicker/DatePicker.helper';
import { onMounted, ref, reactive, watch, onUpdated } from 'vue';

const props = defineProps<{
   label?: string
   class?: string
   icon?: string
   format?: string
   default?: (() => number) | number
   dateSelected?: Date
   customDays?: Array<string>
   customMonths?: Array<string>
   formatUnixDay?: boolean
   onSelect?: (dateSelected: Date) => void
   onShow?: (instance: any) => void
   onHide?: (instance: any) => void
   onMonthChange?: (instance: any) => void
   formatter?: (input: any, date: any, instance: any) => void
}>()
const _fecha = ref<any>(null)
const calendarState = ref<any>(null)
const inputCalendar = ref(null)

// *EMITS
const dateValueEmit = defineEmits<{ (e: "getDate", dateValue: any): void }>();


onMounted(() => {
   const divTime = 1000 * 24 * 60 * 60
   _fecha.value = Math.floor(Date.now() / divTime)
   if (!props.default) dateValueEmit('getDate', _fecha)
   debugger
   const _config: any = {
      onSelect: (instance: any) => {
         const dateSelec: Date = instance.dateSelected
         if (props.onSelect) props.onSelect(dateSelec)
         if (props.formatUnixDay) {
            const _date = Math.floor(dateSelec.getTime() / divTime)
            _fecha.value = _date
         } else {
            _fecha.value = dateSelec.toLocaleDateString()
         }
         console.log('fecha', _fecha.value)
         dateValueEmit('getDate', _fecha)
      },
      onShow: (instance: any) => {
         if (props.onShow) props.onShow(instance)
      },
      onHide: (instance: any) => {
         if (props.onHide) props.onHide(instance)
      },
      onMonthChange: (instance: any) => {
         if (props.onMonthChange) props.onMonthChange(instance)
      },
      // Customizations.

   }
   if (props.dateSelected) _config.dateSelected = props.dateSelected
   if (props.customDays) _config.customDays = props.customDays
   if (props.customMonths) _config.customMonths = props.customMonths
   const calendarInstance = DatePickerHelper.Instancia(inputCalendar.value, _config)
   calendarState.value = calendarInstance
})
watch(props, (_new, _old) => {
   let fecha;
   let numberFecha;
   debugger
   if (_new.default ) {
      if (typeof _new.default == 'function') {
         numberFecha = _new.default()
         // dateValueEmit('getDate',numberDate) 
         fecha = formatDate(numberFecha)
      } else if (typeof _new.default == 'number') {
         numberFecha=_new.default
         fecha = formatDate(numberFecha)
         // dateValueEmit('getDate', props.default) 
      }
      if (fecha) {
         console.log('Fecha Default::', numberFecha)
         _fecha.value = numberFecha
         dateValueEmit('getDate', _fecha)
         if (calendarState.value) {
            calendarState.value.setDate(fecha)
            // calendarState.value.dateSelected(fecha)
            console.log('fecha Date::', fecha)
         }

      }
   }
})
</script>
<template>
   <div :class="'calendar-component form-group w-100 ' + props.class">
      <label v-if="props.label" class="form-label mb-0 text-muted">
         {{ props.label }}</label>
      <div class="calendar relative-position">
         <input type="text" :placeholder="props.format" readonly ref="inputCalendar"
            class="form-control form-control-sm" />
         <label class="absolute end-0 top-0 icon-calendar">
            <span :class="props.icon ? props.icon : 'fa fa-calendar-alt'"></span>
         </label>
      </div>

   </div>
</template>