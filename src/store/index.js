import {configureStore} from "@reduxjs/toolkit";
import isLoading from "./slices/isLoading.slice";
import getProducts from "./slices/getProducts.slice";
import cartProducts from "./slices/cartProducts.slice";
import isLogged from "./slices/isLogged.slice";
import userPurchases from "./slices/userPurchases.slice";

export default configureStore({
    reducer: {
        isLoading,
	getProducts,
	cartProducts,
	isLogged,
	userPurchases
    }
});

