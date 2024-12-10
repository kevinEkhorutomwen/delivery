import { computed, Injectable, signal } from '@angular/core';
import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { DeliveryMethod } from '../../shared/models/delivery-method';
import { collection, deleteDoc, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private firestore: Firestore){}
  collectionName = "cart";
  cart = signal<Cart | null>(null);
  itemCount = computed(() => {
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0)
  });
  selectedDelivery = signal<DeliveryMethod | null>(null);
  totals = computed(() => {
    const cart = this.cart();
    const delivery = this.selectedDelivery();

    if (!cart) return null;
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let discountValue = 0;

    if (cart.coupon) {
      if (cart.coupon.amountOff) {
        discountValue = cart.coupon.amountOff;
      } else if (cart.coupon.percentOff) {
        discountValue = subtotal * (cart.coupon.percentOff / 100);
      }
    }
    
    const shipping = delivery ? delivery.price : 0;

    return {
      subtotal,
      shipping,
      discount: discountValue,
      total: subtotal + shipping - discountValue
    }
  })

  getCart(id: string) {
    const itemRef = doc(this.firestore, `${this.collectionName}/${id}`);
    let a = docData(itemRef, { idField: 'id' });
    a.subscribe({
      next: (cart: Cart) => {
        this.cart.set(cart)
      }
    })
  }

  async setCart(cart: Cart) {
    const { id, ...cartData } = cart;
    const collectionRef = collection(this.firestore, this.collectionName);
    const docRef = doc(collectionRef, id);
    await setDoc(docRef, JSON.parse(JSON.stringify(cartData)));
    const newCart = {...cart};
    this.cart.set(newCart);
  }

  // applyDiscount(code: string) {
  //   return this.http.get<Coupon>(this.baseUrl + 'coupons/' + code);
  // }

  async addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    await this.setCart(cart);
  }

async removeItemFromCart(productId: string, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;
    const index = cart.items.findIndex(x => x.productId === productId);
    if (index !== -1) {
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1);
      }
      if (cart.items.length === 0) {
        this.deleteCart();
      } else {
        this.setCart(cart);
      }
    }
  }

  async deleteCart() {
    try {
      const docRef = doc(this.firestore, `cart/${this.cart()?.id}`);
      
      await deleteDoc(docRef);
      this.cart.set(null);
    } catch{}
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(x => x.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity
    }
    return items;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type
    }
  }

  private isProduct(item: CartItem | Product): item is Product {
    return (item as Product).id !== undefined;
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }
}