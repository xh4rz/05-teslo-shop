import { FC, useMemo, useState } from 'react';
import {
	Box,
	Card,
	CardActionArea,
	CardMedia,
	Grid,
	Typography
} from '@mui/material';
import { IProduct } from '../../interfaces';

interface Props {
	product: IProduct;
}

export const ProductCard: FC<Props> = ({
	product: { images, title, price }
}) => {
	const [isHovered, setIsHovered] = useState(false);

	const productImage = useMemo(() => {
		return isHovered ? `products/${images[1]}` : `products/${images[0]}`;
	}, [isHovered, images]);

	return (
		<Grid
			item
			xs={6}
			sm={4}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<Card>
				<CardActionArea>
					<CardMedia
						component="img"
						className="fadeIn"
						image={productImage}
						alt={title}
					/>
				</CardActionArea>
			</Card>

			<Box sx={{ mt: 1 }} className="fadeIn">
				<Typography fontWeight={700}>{title}</Typography>
				<Typography fontWeight={500}>{`$${price}`}</Typography>
			</Box>
		</Grid>
	);
};
