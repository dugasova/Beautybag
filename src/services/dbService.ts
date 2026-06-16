import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import type { IProduct, IOrder, IAddress, IUserProfile, IUserDocument } from "../types";

// Collection Names
const USERS = "users";
const ORDERS = "orders";

export const dbService = {
  // User Document
  getUserRef: (email: string) => doc(db, USERS, email),

  async getUserData(email: string): Promise<IUserDocument | null> {
    const userDoc = await getDoc(dbService.getUserRef(email));
    return userDoc.exists() ? (userDoc.data() as IUserDocument) : null;
  },

  async updateUserData(email: string, data: object) {
    await setDoc(dbService.getUserRef(email), data, { merge: true });
  },

  // Atomically read the current user document and write back the result of `updater`,
  // avoiding lost updates from concurrent read-modify-write calls.
  async updateUserDataTransaction(email: string, updater: (data: IUserDocument | undefined) => object) {
    const ref = dbService.getUserRef(email);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const data = snap.exists() ? (snap.data() as IUserDocument) : undefined;
      transaction.set(ref, updater(data), { merge: true });
    });
  },

  subscribeToProfile(email: string, callback: (data: IUserProfile) => void) {
    return onSnapshot(dbService.getUserRef(email), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback({
          displayName: data.displayName,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          addresses: data.addresses || [],
        });
      }
    });
  },

  // Addresses
  async addAddress(email: string, address: Omit<IAddress, 'id'>) {
    const newAddress: IAddress = { ...address, id: Date.now().toString() };
    await dbService.updateUserDataTransaction(email, (data) => {
      const existing: IAddress[] = data?.addresses || [];
      return { addresses: [...existing, newAddress] };
    });
  },

  async deleteAddress(email: string, addressId: string) {
    await dbService.updateUserDataTransaction(email, (data) => {
      const existing: IAddress[] = data?.addresses || [];
      return { addresses: existing.filter(a => a.id !== addressId) };
    });
  },

  // Real-time listener for User Data
  subscribeToUser(email: string, callback: (data: IUserDocument) => void) {
    return onSnapshot(this.getUserRef(email), (doc) => {
      if (doc.exists()) callback(doc.data() as IUserDocument);
    });
  },

  // Orders
  async createOrder(email: string, order: Omit<IOrder, 'userId' | 'createdAt'>) {
    const ordersRef = collection(db, USERS, email, ORDERS);
    return await addDoc(ordersRef, {
      ...order,
      userId: email,
      createdAt: new Date(),
    });
  },

  subscribeToOrders(email: string, callback: (orders: IOrder[]) => void, onError?: (error: Error) => void) {
    const ordersRef = collection(db, USERS, email, ORDERS);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IOrder[];
      callback(orders);
    }, onError);
  },

  // Goods/Products
  async fetchAllProducts() {
    const productsRef = collection(db, "goods");
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({
      ...doc.data()
    })) as IProduct[];
  }
};

