import NextLink from 'next/link';
import {
	Box,
	Button,
	Card,
	CardContent,
	Divider,
	Grid,
	Link,
	Typography
} from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';

const SummaryPage = () => {
	return (
		<ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
			<Typography variant="h1" component="h1">
				Resumen de la orden
			</Typography>
			<Grid container>
				<Grid item xs={12} sm={7}>
					<CartList />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Resumen (3 productos)</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">
									Dirección de entrega
								</Typography>
								<NextLink href="/checkout/address" passHref>
									<Link underline="always">Editar</Link>
								</NextLink>
							</Box>

							<Typography>Harold Gonzalez</Typography>
							<Typography>323 Algún lugar</Typography>
							<Typography>Calle 101, ABC 123</Typography>
							<Typography>Bogotá</Typography>
							<Typography>+57 3024032590</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="end">
								<NextLink href="/cart" passHref>
									<Link underline="always">Editar</Link>
								</NextLink>
							</Box>

							<OrderSummary />

							<Box sx={{ mt: 3 }}>
								<Button color="secondary" className="circular-btn" fullWidth>
									Confirmar Orden
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export default SummaryPage;
