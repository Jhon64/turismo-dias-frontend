export const ListasHelper = {
  existeElemento: (array: any[], key: string, valorBusqueda: any): boolean => {
    const result = array.find((x) => x[key] == valorBusqueda);
    console.log(result);
    return result !== undefined;
  },
  BuscarValor: (array: any[], key: string, valorBusqueda: any): any => {
    const result = array.find((x) => x[key] == valorBusqueda);
    return result !== undefined ? result : null;
  },
  ObtenerIndex: (array: any[], key: string, valorBusqueda: any): any => {
    const result = array.findIndex((x) => x[key] == valorBusqueda);
    return result !== -1 ? result : null;
  },
  QuitarElemento: (array: any[], index: number): any => {
    return array.splice(index, 1);
  },
};