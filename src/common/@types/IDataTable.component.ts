export type HeaderDataTable = Array<THDataTable>

export interface THDataTable {
    _key?: any,
    label?: string
    sorting?: boolean
    typeSorting?: 'ASC' | 'DESC',
    filter?: boolean
    style?: string
    class?: string
}