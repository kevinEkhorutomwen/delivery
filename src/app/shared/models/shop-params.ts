import { DocumentSnapshot } from "@angular/fire/firestore";
import { Product } from "./product";

export class ShopParams {
    brands: string[] = [];
    types: string[] = [];
    sort = 'name';
    sortOrder: 'desc' | 'asc' = 'desc';
    pageNumber = 1;
    pageSize = 10;
    direction?: 'forward' | 'backward';
    search = '';
}
