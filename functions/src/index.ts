import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialisiere Firebase Admin SDK
admin.initializeApp();

export const onProductCreated = functions.firestore.onDocumentCreated(
  "products/{productId}",
  async (event) => {
    const snap = event.data; // Das Snapshot des Dokuments

    // Sicherstellen, dass Daten vorhanden sind
    if (!snap) {
      return null;
    }

    const product = snap.data();
    const brand = product?.brand;
    const type = product?.type;

    if (!brand) {
      const brandRef = admin.firestore().collection("brand").doc(brand);

      const brandDoc = await brandRef.get();

      if (!brandDoc.exists) {
        await brandRef.set({
          name: brand,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    if (!type) {
      const typeRef = admin.firestore().collection("type").doc(type);

      // Überprüfen, ob die Marke schon existiert, um Duplikate zu vermeiden
      const typeDoc = await typeRef.get();

      if (!typeDoc.exists) {
        // Marke speichern, falls sie noch nicht existiert
        await typeRef.set({
          name: type,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    return null;
  }
);
