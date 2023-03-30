import axios from "axios";

const URL_API_PERU = import.meta.env.VITE_APIPERU_ROUTE;
const URL_API_PERU_AUX = 'https://apitomolab.wost.pe/api/customers';
const TOKEN_API_PERU = import.meta.env.VITE_APIPERU_TOKEN;

export const APIPERU = {
  consulta_ruc: async (ruc: string) =>
    // await axios.get(URL_API_PERU + `/${ruc}`, {
      await axios.get(URL_API_PERU_AUX + `/${ruc}/search-document`, {
      headers: {
        authorization: `Bearer ${TOKEN_API_PERU}`,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true
      },
    }),
};
