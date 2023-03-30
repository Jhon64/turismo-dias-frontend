
export interface ClientesDocumentosResponse {
    id: number
    ruc: string
    razonSocial: string
    documentos: Array<DocClienteResponse>
}

export interface DocClienteResponse {
    id: number
    status: boolean
    obligatorio: boolean
    documentoId: number
    insertDB:boolean
    documentoNombre: string
}