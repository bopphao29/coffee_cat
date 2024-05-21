import { Injectable } from "@angular/core"

export interface Menu {
    state: string,
    name: string,
    icon: string,
    role:string
}

const MENUITEMS = [
    {
        state: 'dashboard',
        name: 'Thống kê',
        icon: 'dashboard',
        role: 'admin' || 'user'
    },
    {
        state: 'category',
        name: 'Quản lý danh mục',
        icon: 'category',
        role: 'admin'
    },
    {
        state: 'product',
        name: 'Quản Lý Sản Phẩm',
        icon: 'inventory_2',
        role: 'admin'
    },
    {
        state: 'order',
        name: 'Quản lý đặt hàng',
        icon: 'list_alt',
        role: ''
    },
    {
        state: 'bill',
        name: 'Quản lý hóa đơn',
        // icon: 'import_contact',
        icon:'description',
        role: ''
    },
    {
        state: 'user',
        name: 'Quản lý người dùng',
        icon: 'people',
        role: 'admin'
    },
    
]

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MENUITEMS;
    }
}