import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
	numberOfOrders: number;
	paidOrders: number; // isPaid true
	notPaidOrders: number; // isPaid false
	numberOfClients: number; // role: client
	numberOfProducts: number;
	productsWithNoInventory: number; // 0
	lowInventory: number; // productos con 10 o menos
};

export default async function handlder(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	await db.connect();

	const numberOfOrders = await Order.count();

	const paidOrders = await Order.find({ isPaid: true }).count();

	const notPaidOrders = await Order.find({ isPaid: false }).count();

	const numberOfClients = await User.find({ role: 'client' }).count();

	const numberOfProducts = await Product.count();

	const productsWithNoInventory = await Product.find({ inStock: 0 }).count();

	const lowInventory = await Product.find({
		inStock: { $gt: 0, $lt: 10 }
	}).count();

	await db.disconnect();

	res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	});
}
