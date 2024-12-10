import { Injectable } from '@angular/core';
import { OrderParams } from '../../shared/models/order-params';
import { Order } from '../../shared/models/order';
import { collection, collectionData, doc, docData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  collectionName = "order"
  constructor(private firestore: Firestore){}

  getOrders(orderParams: OrderParams): Observable<Order[]> {
    const itemsRef = collection(this.firestore, this.collectionName);

    // Baue die Abfrage basierend auf den Filtern
    let q = query(itemsRef, where('userId', '==', "userId"));

    if (orderParams.filter && orderParams.filter !== 'All') {
      q = query(q, where('status', '==', orderParams.filter));
    }

    return collectionData(q, { idField: 'id' }); // idField fügt die Dokument-ID hinzu
  }


  getOrder(id: string): Observable<Order> {
    const itemRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return docData(itemRef, { idField: 'id' });
  }

  refundOrder(docId: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${docId}`);
    return updateDoc(docRef, { ["status"]: "Refunded" });
  }

  updateItem(id: string, data: any): Promise<void> {
    const itemRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return updateDoc(itemRef, data);
  }

}