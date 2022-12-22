import NextLink from 'next/link';
import {
	Box,
	Button,
	CardActionArea,
	CardMedia,
	Grid,
	Link,
	Typography
} from '@mui/material';
import { ItemCounter } from '../ui';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';

interface Props {
	editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
	const { cart } = useContext(CartContext);

	return (
		<>
			{cart.map(({ slug, image, title, price, size, quantity }) => (
				<Grid container spacing={2} key={slug} sx={{ mb: 1 }}>
					<Grid item xs={3}>
						<NextLink href="/product/slug" passHref>
							<Link>
								<CardActionArea>
									<CardMedia
										image={`/products/${image}`}
										component="img"
										sx={{ borderRadius: '5px' }}
									/>
								</CardActionArea>
							</Link>
						</NextLink>
					</Grid>
					<Grid item xs={7}>
						<Box display="flex" flexDirection="column">
							<Typography variant="body1">{title}</Typography>
							<Typography variant="body1">
								Talla: <strong>{size}</strong>
							</Typography>

							{editable ? (
								<ItemCounter
									currentValue={quantity}
									maxValue={10}
									updatedQuantity={() => {}}
								/>
							) : (
								<Typography variant="h5">
									{quantity} {quantity > 1 ? 'productos' : 'producto'}
								</Typography>
							)}
						</Box>
					</Grid>
					<Grid
						item
						xs={2}
						display="flex"
						alignItems="center"
						flexDirection="column"
					>
						<Typography variant="subtitle1">{`$${price}`}</Typography>

						{editable && (
							<Button variant="text" color="secondary">
								Remover
							</Button>
						)}
					</Grid>
				</Grid>
			))}
		</>
	);
};
