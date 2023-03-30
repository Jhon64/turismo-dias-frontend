export interface ProyectoBuscarUnoResponse {
    id: number
    moneda: string
    nombre: string
    responsable: string
    tarifaHora: number
    cliente: ClienteProyecto
    estado_proyecto: string
    documentosProyecto: documentoProyecto[]
}

export interface documentoProyecto {
    id: number
    documentoId: number
    documentoNombre: string
    obligatorio: boolean
    status: boolean
}

export interface ClienteProyecto {
    id: number
    razonSocial: string
}