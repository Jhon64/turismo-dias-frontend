export interface IPagination{
    totalDataRows?:number
    rowsPerPage?:number|null
    totalPages?:number
    actualPage?:number|null
    nextPage?:number|null
    prevPage?:number|null
    firstPage?:number|null
    lastPage?:number|null
    actualPageUrl?:string|null
    nextPageUrl?:string|null
    prevPageUrl?:string|null
    firstPageUrl?:string|null
    lastPageUrl?:string|null
}