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
	// const numberOfOrders = await Order.count();

	// const paidOrders = await Order.find({ isPaid: true }).count();

	// const numberOfClients = await User.find({ role: 'client' }).count();

	// const numberOfProducts = await Product.count();

	// const productsWithNoInventory = await Product.find({ inStock: 0 }).count();

	// const lowInventory = await Product.find({
	// 	inStock: { $lte: 10 }
	// }).count();

	await db.connect();

	const [
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	] = await Promise.all([
		Order.count(),
		Order.find({ isPaid: true }).count(),
		User.find({ role: 'client' }).count(),
		Product.count(),
		Product.find({ inStock: 0 }).count(),
		Product.find({
			inStock: { $lte: 10 }
		}).count()
	]);

	await db.disconnect();

	res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders: numberOfOrders - paidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	});
}
