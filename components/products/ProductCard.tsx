import { FC, useMemo, useState } from 'react';
import NextLink from 'next/link';
import {
	Box,
	Card,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
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
	const [isImageLoaded, setIsImageLoaded] = useState(false);

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
				<NextLink href="/product/slug" passHref prefetch={false}>
					<Link>
						<CardActionArea>
							<CardMedia
								component="img"
								className="fadeIn"
								image={productImage}
								alt={title}
								onLoad={() => setIsImageLoaded(true)}
							/>
						</CardActionArea>
					</Link>
				</NextLink>
			</Card>
			<Box
				sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none' }}
				className="fadeIn"
			>
				<Typography fontWeight={700}>{title}</Typography>
				<Typography fontWeight={500}>{`$${price}`}</Typography>
			</Box>
		</Grid>
	);
};
