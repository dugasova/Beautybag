import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { goods } from './mockedData';

export const uploadDataToFirebase = async () => {
  try {
    const goodsCollection = collection(db, 'goods');
    for (const item of goods) {
      const docRef = doc(goodsCollection, item.id.toString());
      await setDoc(docRef, item);
    }
    alert('Goods uploaded successfully!');
  } catch (error) {
    console.error('Error uploading goods:', error);
    alert('Failed to upload goods. See console for details.');
  }
};
