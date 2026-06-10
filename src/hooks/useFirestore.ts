import { dbService } from "../services/dbService";
import { UserAuth } from "../context/AuthContext";
import type { IProduct, IOrder, ICartItem } from "../types";

export default function useFirestore() {
  const { user } = UserAuth();

  const updateWishList = async (product: IProduct, isFavorite: boolean) => {
    if (!user?.email) return;

    if (isFavorite) {
      const data = await dbService.getUserData(user.email);
      const currentWishList = data?.wishList || [];
      const filteredList = currentWishList.filter((item: IProduct) => item.id !== product.id);
      await dbService.updateUserData(user.email, { wishList: filteredList });
    } else {
      const data = await dbService.getUserData(user.email);
      const currentWishList = data?.wishList || [];
      await dbService.updateUserData(user.email, { wishList: [...currentWishList, product] });
    }
  };

  const updateCartList = async (product: IProduct, isInCart: boolean) => {
    if (!user?.email) return;

    if (isInCart) {
      const data = await dbService.getUserData(user.email);
      const currentCart = data?.savedProducts || [];
      const filteredList = currentCart.filter((item: IProduct) => item.id !== product.id);
      await dbService.updateUserData(user.email, { savedProducts: filteredList });
    } else {
      const data = await dbService.getUserData(user.email);
      const currentCart = data?.savedProducts || [];
      await dbService.updateUserData(user.email, { 
        savedProducts: [...currentCart, { ...product, totalQuantity: 1 }] 
      });
    }
  };

  const moveFromCartToWishList = async (product: IProduct) => {
    if (!user?.email) return;

    const data = await dbService.getUserData(user.email);
    const currentCart = data?.savedProducts || [];
    const currentWish = data?.wishList || [];
    
    const filteredCart = currentCart.filter((item: IProduct) => item.id !== product.id);
    
    await dbService.updateUserData(user.email, {
      savedProducts: filteredCart,
      wishList: [...currentWish, product]
    });
  };

  const sendOrder = async (order: Omit<IOrder, 'userId' | 'createdAt'>) => {
    if (!user?.email) return;

    await dbService.createOrder(user.email, order);
    await dbService.updateUserData(user.email, { savedProducts: [] });
  };

  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (!user?.email) return;

    const data = await dbService.getUserData(user.email);
    const currentCart = data?.savedProducts || [];
    const updatedCart = currentCart.map((item: ICartItem) => 
      item.id === productId ? { ...item, totalQuantity: newQuantity } : item
    );
    await dbService.updateUserData(user.email, { savedProducts: updatedCart });
  };

  return { updateWishList, updateCartList, moveFromCartToWishList, sendOrder, updateCartQuantity };
}
