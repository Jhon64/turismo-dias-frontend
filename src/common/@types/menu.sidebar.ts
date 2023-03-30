export interface Menu {
    clases?: string;
    color?: string;
    css?: string;
    descripcion?: string;
    estado?: boolean;
    icono?: string;
    nombre?: string;
    url?: string;
    _id?: string;
}

export interface Submenu {
    clases?: string;
    color?: string;
    css?: string;
    descripcion?: string;
    estado?: boolean;
    icono?: string;
    nombre?: string;
    url?: string;
    _id?: string;
}

export interface MenuDetalle {
    clases?: string;
    color?: string;
    css?: string;
    descripcion?: string;
    estado?: boolean;
    icono?: string;
    nombre?: string;
    url?: string;
    _id?: string;
    submenus: Submenu[];
}
