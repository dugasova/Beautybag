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
  type DocumentData
} from "firebase/firestore";
import type { IProduct, IOrder, IAddress, IUserProfile } from "../types";

// Collection Names
const USERS = "users";
const ORDERS = "orders";

export const dbService = {
  // User Document
  getUserRef: (email: string) => doc(db, USERS, email),

  async getUserData(email: string) {
    const userDoc = await getDoc(this.getUserRef(email));
    return userDoc.exists() ? userDoc.data() : null;
  },

  async updateUserData(email: string, data: object) {
    await setDoc(this.getUserRef(email), data, { merge: true });
  },

  // Profile
  async updateProfile(email: string, profile: IUserProfile) {
    await setDoc(this.getUserRef(email), profile, { merge: true });
  },

  subscribeToProfile(email: string, callback: (data: IUserProfile) => void) {
    return onSnapshot(this.getUserRef(email), (snap) => {
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
    const userData = await this.getUserData(email);
    const existing: IAddress[] = userData?.addresses || [];
    await setDoc(this.getUserRef(email), { addresses: [...existing, newAddress] }, { merge: true });
  },

  async deleteAddress(email: string, addressId: string) {
    const userData = await this.getUserData(email);
    const existing: IAddress[] = userData?.addresses || [];
    await setDoc(this.getUserRef(email), {
      addresses: existing.filter(a => a.id !== addressId)
    }, { merge: true });
  },

  // Real-time listener for User Data
  subscribeToUser(email: string, callback: (data: DocumentData) => void) {
    return onSnapshot(this.getUserRef(email), (doc) => {
      if (doc.exists()) callback(doc.data());
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

  subscribeToOrders(email: string, callback: (orders: IOrder[]) => void) {
    const ordersRef = collection(db, USERS, email, ORDERS);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as IOrder[];
      callback(orders);
    });
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

