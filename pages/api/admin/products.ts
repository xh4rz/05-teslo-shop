import type { NextApiRequest, NextApiResponse } from 'next';
import { IProduct } from '../../../interfaces';
import { db } from '../../../database';
import { Product } from '../../../models';
import { isValidObjectId } from 'mongoose';

type Data =
	| {
			message: string;
	  }
	| IProduct[]
	| IProduct;

export default function hanlder(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case 'GET':
			return getProducts(req, res);

		case 'PUT':
			return updateProducts(req, res);

		case 'POST':

		default:
			return res.status(400).json({
				message: 'Bad request'
			});
	}
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	await db.connect();

	const products = await Product.find().sort({ title: 'asc' }).lean();

	await db.disconnect();

	// TODO: Tendremos que actualizar las imagenes

	res.status(200).json(products);
};

const updateProducts = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { _id = '', images = [] } = req.body as IProduct;

	if (!isValidObjectId(_id)) {
		return res.status(400).json({
			message: 'El id del producto no es válido'
		});
	}

	if (images.length < 2) {
		return res.status(400).json({
			message: 'Es necesario al menos 2 imágenes'
		});
	}

	// TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg

	try {
		await db.connect();

		const product = await Product.findById(_id);

		if (!product) {
			await db.disconnect();
			return res.status(400).json({
				message: 'No existe un producto con ese ID'
			});
		}

		// TODO: eliminar fotos en Cloudinary

		await product.update(req.body);

		await db.disconnect();

		return res.status(200).json(product);
	} catch (error) {
		console.log(error);

		await db.disconnect();

		return res.status(400).json({
			message: 'Revisar la consola del servidor'
		});
	}
};
