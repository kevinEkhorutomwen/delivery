import { Injectable } from '@angular/core';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shop-params';
import { collection, collectionData, doc, docData, getCountFromServer, Firestore, limit, orderBy, query, startAfter, DocumentSnapshot, endBefore, getDocs, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  collectionName = "product"
  lastProduct?: DocumentSnapshot<Product>;
  firstProduct?: DocumentSnapshot<Product>;

  constructor(private firestore: Firestore){}
  types: string[] = [];
  brands: string[] = [];

  getProducts(shopParams: ShopParams): Promise<{ data: Observable<Product[]>; totalCount: number }> {
    const itemsRef = collection(this.firestore, this.collectionName);
    return collectionData(itemsRef, { idField: 'id' });
  }

  async getProductsWithPagination(shopParams: ShopParams): Promise<Pagination<Product>> {
    const itemsRef = collection(this.firestore, this.collectionName);

    let q = query(itemsRef, orderBy(shopParams.sort, shopParams.sortOrder))

    if(shopParams.search){
      q = query(q,
        where('name', '>=', shopParams.search),
        where('name', '<', shopParams.search + '\uf8ff')
      );
    }

    if(shopParams.brands.length > 0){
      q = query(q, where('brand', 'in', shopParams.brands));
    }

    if(shopParams.types.length > 0){
      q = query(q, where('type', 'in', shopParams.types));
    }

    const count = await getCountFromServer(q);
    const totalCount = count.data().count;

    q = query(q, limit(shopParams.pageSize));

    switch(shopParams.direction){
      case('forward'):
      q = query(q, startAfter(this.lastProduct));
      break;
      case('backward'):
      q = query(q, endBefore(this.firstProduct))
      break;
    }

    const document = await getDocs(q);
    if(document.size > 0){
      this.firstProduct = document.docs[0] as DocumentSnapshot<Product>;
      this.lastProduct = document.docs[document.size -1] as DocumentSnapshot<Product>;
  }

    const products =  document.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return {
      count: totalCount,
      pageIndex: shopParams.pageNumber,
      pageSize: shopParams.pageSize,
      data: products as unknown as Product[]
    }
  }

  getProduct(id: string): Observable<Product> {
    const itemRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(itemRef, { idField: 'id' });
  }

  async getBrands() {
    const itemsRef = collection(this.firestore, "brand");
    let q = query(itemsRef);
    const document = await getDocs(q);
    this.brands = document.docs.map(doc => doc.id);
  }

  async getTypes() {
    const itemsRef = collection(this.firestore, "type");
    let q = query(itemsRef);
    const document = await getDocs(q);
    this.types = document.docs.map(doc => doc.id);
  }
}
