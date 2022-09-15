import type { NextPage } from 'next';
import { ShopLayout } from '../components/layouts';
import {
	Card,
	CardActionArea,
	CardMedia,
	Grid,
	Typography
} from '@mui/material';
import { initialData } from '../database/products';

const Home: NextPage = () => {
	return (
		<ShopLayout
			title={'Teslo-Shop - Home'}
			pageDescription={'Encuentra los mejores productos de Teslo Aquí'}
		>
			<Typography variant="h1" component="h1">
				Tienda
			</Typography>
			<Typography variant="h2" sx={{ mb: 1 }}>
				Todos los productos
			</Typography>

			<Grid container spacing={4}>
				{initialData.products.map(({ slug, images, title }) => (
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
				))}
			</Grid>
		</ShopLayout>
	);
};

export default Home;
