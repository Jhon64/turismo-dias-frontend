import type { HeaderDataTable, THDataTable } from "@types/IDataTable.component";

export interface DatatableType {
  data: any[];
  header: HeaderDataTable;
  filter?: boolean;
}
