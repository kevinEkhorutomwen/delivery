import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DataImportService {
  constructor(private firestore: Firestore) {}

  /**
   * Import data from a JSON array into Firestore
   * @param jsonData Array of objects representing the data to import
   * @param collectionName Firestore collection where the data will be stored
   */
  async importData(jsonData: any[], collectionName: string): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);

    for (const item of jsonData) {
      try {
        // Create a new document with an auto-generated ID
        const docRef = doc(collectionRef);
        await setDoc(docRef, item);
        console.log(`Successfully added document:`, item);
      } catch (error) {
        console.error(`Error adding document:`, item, error);
      }
    }

    console.log('Data import completed.');
  }

  async importDataType(jsonData: any[], collectionName: string): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);

    for (const item of jsonData) {
      try {
        // Nur das 'type' Feld extrahieren
        const brand = item.brand;

        // Überprüfen, ob der 'type' bereits in der Sammlung existiert
        const brandRef = doc(collectionRef, brand);
        const brandDoc = await getDoc(brandRef);

        if (!brandDoc.exists()) {
          // Speichern, wenn der 'brand' noch nicht existiert
          await setDoc(brandRef, { brand });
          console.log(`Successfully added brand: ${brand}`);
        } else {
          console.log(`brand ${brand} already exists.`);
        }
      } catch (error) {
        console.error(`Error adding brand:`, item, error);
      }
    }

    console.log('Data import completed.');
  }
}