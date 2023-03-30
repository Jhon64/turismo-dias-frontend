export interface BreadcrumbItem {
  name: String;
  url?: String;
  icon?: String;
  active?: Boolean;
}

export type BreadCrumb = Array<BreadcrumbItem>