export interface IApiPeru {
  success: string;
  data: IApiPeruData;
  message?:string
}

export interface IApiPeruData {
  ruc: string;
  nombre_o_razon_social: string;
  direccion: string;
  direccion_sunat: string;
  direccion_completa: string;
  direccion_reniec: string;
  estado: string;
}
