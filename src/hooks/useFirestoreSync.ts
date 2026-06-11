import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { dbService } from "../services/dbService";
import { UserAuth } from "../context/AuthContext";
import { setWishList, clearWishList } from "../store/features/wishList/slice";
import { setCartList, clearCart } from "../store/features/cartList/slice";

export default function useFirestoreSync() {
  const { user } = UserAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.email) {
      const unsubscribe = dbService.subscribeToUser(user.email, (data) => {
        if (data.wishList) dispatch(setWishList(data.wishList));
        if (data.savedProducts) dispatch(setCartList(data.savedProducts));
      });
      return () => unsubscribe();
    }

    dispatch(clearWishList());
    dispatch(clearCart());
  }, [user, dispatch]);
}
