import Notiflix, { Notify } from "notiflix";

 export const ArrayToMap=(array: any[], key: string, group?: boolean)=> {
   if (!key) { return Notify.failure('Pasar Key agrupador') }
   const _map = new Map()
   for (let _item of array) {
      if (_map.has(_item[key])) {
         if (group) {
            _map.get(_item[key]).push(_item)
         } else {
            _map.set(_item[key],_item)
         }
      } else {
         if (group) {
            _map.set(_item[key],[_item])
         } else {
            _map.set(_item[key],_item)
         }
      }
   }
   return _map;
 }

