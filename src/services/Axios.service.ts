// @ts-ignore
import axios, {AxiosRequestConfig} from 'axios'
import {StorageHelper} from "@/helpers/LocalStorage/storage.helper";
import {LoadingSpinner} from "@/helpers/Spinner/Loading.spinner";


// const axios:any = axios.create({
//   "Access-Control-Allow-Private-Network": true
// });

// AGREGANDO UN INTERCEPTOR PARA ENVIAR EL TOKEN
axios.interceptors.request.use(function (configuracion: AxiosRequestConfig) {
  LoadingSpinner.Circle();
  const VITE_ROUTE_API = import.meta.env.VITE_ROUTE_API;
  if (configuracion.url?.includes(VITE_ROUTE_API))
    if (StorageHelper.getTokenAuth() !== null)
      //@ts-ignore
      configuracion.headers = {
        Authorization: `Bearer ${StorageHelper.getTokenAuth()}`,
        "Access-Control-Allow-Origin": "*",
    }
      // configuracion.headers.Authorization = `Bearer ${StorageHelper.getTokenAuth()}`;
  
  LoadingSpinner.Remove();
  return configuracion;
});

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log('axios Default Response', response)
    //seteando la informacion del response
    const VITE_ROUTE_API = import.meta.env.VITE_ROUTE_API;
    //console.log(response.request)
    // console.log('Validacion de response', response.data)
    // debugger
    if (response.request.responseURL.includes(VITE_ROUTE_API)) {
      // *PARSEAMOS LA INFORMACION CUANDO SEA SOLO EN LA APP
      // console.log('validando ...')
      if (
        response.data != undefined &&
        response.data.pagination === undefined
      ) {
        // if ( response.data.length == 0)
        // console.log(Array.isArray(response.data));
        if (!Array.isArray(response.data)) response.data = response.data;
        // console.log('validacion 1')
      }
      else if (
        response.data != undefined &&
        response.data.pagination !== undefined &&
        response.data.pagination.actualPage == undefined
      ) {
        response.data =response.data;
        // console.log('validacion 2S')
      } else {
        response.data =response.data;
      }
    }

    LoadingSpinner.Remove();
    return response;
  },
  function (error) {
    // console.log('axios default Error', error.response)
    const VITE_ROUTE_API = import.meta.env.VITE_ROUTE_API;
    if (error.response.request.responseURL.includes(VITE_ROUTE_API)) {
      // *PARSEAMOS LA INFORMACION CUANDO SEA SOLO EN LA APP
      // if (error.response != undefined && error.response.status == 401) {
      //   //redireccionando al login
      //   StorageHelper.limpiarStorage();
      //   window.location.href = import.meta.env.VITE_APP_ROUTE + "/login";
      // }
      if (error.response != undefined && error.response.status == 500) {
        error = error.response.data;
      }
    }
    LoadingSpinner.Remove();
    return Promise.reject(error);
  }
);


export const AxiosService = {
    GET: async (url: string,  params:any, headers: any | undefined = undefined, authorizeJWT: boolean = true, ) => {
      const  request = { params }
        return await axios.get(url, request)
    },
    POST: async (url: string, body: any, headers: AxiosRequestConfig | undefined = undefined) => {
        return await axios.post(url, body,{...headers}||{})
    },
    DELETE: async (url: string, authorizeJWT: boolean = true, headers: any | undefined = undefined) => {
        return await axios.delete(url)
    },
    PUT: async (url: string, body: any, authorizeJWT: boolean = true, headers: any | undefined = undefined) => {
        return await axios.put(url, body)
    },
}