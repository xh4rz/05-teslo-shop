import { FC } from 'react';
import { Card, CardActionArea, CardMedia, Grid } from '@mui/material';
import { IProduct } from '../../interfaces';

interface Props {
	product: IProduct;
}

export const ProductCard: FC<Props> = ({
	product: { slug, images, title }
}) => {
	return (
		<Grid item xs={6} sm={4} key={slug}>
			<Card>
				<CardActionArea>
					<CardMedia
						component="img"
						image={`products/${images[0]}`}
						alt={title}
					/>
				</CardActionArea>
			</Card>
		</Grid>
	);
};
