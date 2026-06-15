import { dbService } from "../services/dbService";
import { UserAuth } from "../context/AuthContext";
import type { IProduct, IOrder, IUserDocument } from "../types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const getList = <K extends 'wishList' | 'savedProducts'>(
  data: IUserDocument | undefined,
  field: K
): NonNullable<IUserDocument[K]> => {
  return (data?.[field] || []) as NonNullable<IUserDocument[K]>;
};

export default function useFirestore() {
  const { user } = UserAuth();
  const { t } = useTranslation();

  const withErrorHandling = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      console.error("Firestore Error:", error);
      toast.error(t('common.error'));
    }
  };

  const updateWishList = async (product: IProduct, isFavorite: boolean) => {
    if (!user?.email) return;

    await withErrorHandling(() => dbService.updateUserDataTransaction(user.email!, (data) => {
      const currentWishList = getList(data, 'wishList');

      if (isFavorite) {
        return { wishList: currentWishList.filter((item) => item.id !== product.id) };
      }
      return { wishList: [...currentWishList, product] };
    }));
  };

  const clearWishList = async () => {
    if (!user?.email) return;

    await withErrorHandling(() => dbService.updateUserDataTransaction(user.email!, () => ({ wishList: [] })));
  };

  const updateCartList = async (product: IProduct, isInCart: boolean) => {
    if (!user?.email) return;

    await withErrorHandling(() => dbService.updateUserDataTransaction(user.email!, (data) => {
      const currentCart = getList(data, 'savedProducts');

      if (isInCart) {
        return { savedProducts: currentCart.filter((item) => item.id !== product.id) };
      }
      return { savedProducts: [...currentCart, { ...product, totalQuantity: 1 }] };
    }));
  };

  const moveFromCartToWishList = async (product: IProduct) => {
    if (!user?.email) return;

    await withErrorHandling(() => dbService.updateUserDataTransaction(user.email!, (data) => {
      const currentCart = getList(data, 'savedProducts');
      const currentWish = getList(data, 'wishList');

      return {
        savedProducts: currentCart.filter((item) => item.id !== product.id),
        wishList: [...currentWish, product],
      };
    }));
  };

  const sendOrder = async (order: Omit<IOrder, 'userId' | 'createdAt'>) => {
    if (!user?.email) return;

    await withErrorHandling(async () => {
      await dbService.createOrder(user.email!, order);
      await dbService.updateUserDataTransaction(user.email!, () => ({ savedProducts: [] }));
    });
  };

  const updateCartQuantity = async (productId: number, newQuantity: number) => {
    if (!user?.email) return;

    await withErrorHandling(() => dbService.updateUserDataTransaction(user.email!, (data) => {
      const currentCart = getList(data, 'savedProducts');
      const updatedCart = currentCart.map((item) =>
        item.id === productId ? { ...item, totalQuantity: newQuantity } : item
      );
      return { savedProducts: updatedCart };
    }));
  };

  return { updateWishList, clearWishList, updateCartList, moveFromCartToWishList, sendOrder, updateCartQuantity };
}
