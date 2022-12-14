import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct } from '../../interfaces';
import { CartContext, cartReducer } from './';

export interface CartState {
	cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
	cart: []
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

	useEffect(() => {
		try {
			const cookieProducts = Cookie.get('cart')
				? JSON.parse(Cookie.get('cart')!)
				: [];

			dispatch({
				type: '[Cart] - LoadCart from cookies | storage',
				payload: cookieProducts
			});
		} catch (error) {
			dispatch({
				type: '[Cart] - LoadCart from cookies | storage',
				payload: []
			});
		}
	}, []);

	useEffect(() => {
		Cookie.set('cart', JSON.stringify(state.cart));
	}, [state.cart]);

	const addProductToCart = (product: ICartProduct) => {
		const productInCart = state.cart.some((p) => p._id === product._id);

		if (!productInCart)
			return dispatch({
				type: '[Cart] - Update products in cart',
				payload: [...state.cart, product]
			});

		const productInCartButDifferentSize = state.cart.some(
			(p) => p._id === product._id && p.size === product.size
		);

		if (!productInCartButDifferentSize)
			return dispatch({
				type: '[Cart] - Update products in cart',
				payload: [...state.cart, product]
			});

		// Acumular
		const updatedPoducts = state.cart.map((p) => {
			if (p._id !== product._id) return p;
			if (p.size !== product.size) return p;

			// Actualizar la cantidad
			p.quantity += product.quantity;
			return p;
		});

		dispatch({
			type: '[Cart] - Update products in cart',
			payload: updatedPoducts
		});
	};

	const updateCartQuantity = (product: ICartProduct) => {
		dispatch({
			type: '[Cart] - Change cart quantity',
			payload: product
		});
	};

	const removeCartProduct = (product: ICartProduct) => {
		dispatch({
			type: '[Cart] - Remove product in cart',
			payload: product
		});
	};

	return (
		<CartContext.Provider
			value={{
				...state,

				//Methods
				addProductToCart,
				updateCartQuantity,
				removeCartProduct
			}}
			// Methods
		>
			{children}
		</CartContext.Provider>
	);
};
