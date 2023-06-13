import type { NextApiRequest, NextApiResponse } from 'next';
import { IOrder } from '../../../interfaces';
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = {
	message: string;
};

export default async function hanlder(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'POST':
			return createOrder(req, res);

		default:
			return res.status(400).json({ message: 'Bad request' });
	}
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { orderItems, total } = req.body as IOrder;

	const session = await getSession({ req });

	// Verificar que tengamos un usuario
	if (!session) {
		return res
			.status(401)
			.json({ message: 'Debe estar autenticado para hacer esto' });
	}

	// Crear un arreglo con los productos que la persona quiere
	const productsIds = orderItems.map((product) => product._id);

	await db.connect();

	const dbProducts = await Product.find({ _id: { $in: productsIds } });

	try {
		const subTotal = orderItems.reduce((prev, current) => {
			const currentPrice = dbProducts.find(
				(prod) => prod.id === current._id
			)?.price;

			if (!currentPrice) {
				throw new Error('Verifique el carrito de nuevo, producto no existe');
			}

			return currentPrice * current.quantity + prev;
		}, 0);
	} catch (error) {}

	return res.status(201).json(req.body);
};