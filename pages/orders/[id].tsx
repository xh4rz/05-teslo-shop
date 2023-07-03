import { GetServerSideProps, NextPage } from 'next';
import {
	Box,
	Card,
	CardContent,
	Chip,
	Divider,
	Grid,
	Typography
} from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { CartList, OrderSummary } from '../../components/cart';
import {
	CreditCardOffOutlined,
	CreditScoreOutlined
} from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { countries } from '../../utils';
import { PayPalButtons } from '@paypal/react-paypal-js';

interface Props {
	order: IOrder;
}

const OrderPage: NextPage<Props> = ({
	order: {
		_id,
		isPaid,
		numberOfItems,
		subTotal,
		total,
		tax,
		shippingAddress: {
			firstName,
			lastName,
			address,
			address2,
			city,
			zip,
			country,
			phone
		},
		orderItems
	}
}) => {
	return (
		<ShopLayout
			title="Resumen de la orden 123456789"
			pageDescription="Resumen de la orden"
		>
			<Typography variant="h1" component="h1">
				Orden: {_id}
			</Typography>

			{isPaid ? (
				<Chip
					sx={{ my: 2 }}
					label="Orden ya fue pagada"
					variant="outlined"
					color="success"
					icon={<CreditScoreOutlined />}
				/>
			) : (
				<Chip
					sx={{ my: 2 }}
					label="Pendiente de pago"
					variant="outlined"
					color="error"
					icon={<CreditCardOffOutlined />}
				/>
			)}

			<Grid container className="fadeIn">
				<Grid item xs={12} sm={7}>
					<CartList products={orderItems} />
				</Grid>
				<Grid item xs={12} sm={5}>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">
								Resumen ({numberOfItems}{' '}
								{numberOfItems > 1 ? 'productos' : 'producto'} )
							</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">
									Dirección de entrega
								</Typography>
							</Box>

							<Typography>
								{firstName} {lastName}
							</Typography>
							<Typography>
								{address} {address2 ? `, ${address2}` : ''}
							</Typography>
							<Typography>
								{city}, {zip}
							</Typography>
							<Typography>
								{countries.find((i) => i.code === country)?.name}
							</Typography>
							<Typography>{phone}</Typography>

							<Divider sx={{ my: 1 }} />

							<OrderSummary
								orderValues={{ numberOfItems, subTotal, total, tax }}
							/>

							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								{isPaid ? (
									<Chip
										sx={{ my: 2 }}
										label="Orden ya fue pagada"
										variant="outlined"
										color="success"
										icon={<CreditScoreOutlined />}
									/>
								) : (
									<PayPalButtons
										createOrder={(data, actions) => {
											return actions.order.create({
												purchase_units: [
													{
														amount: {
															value: '2000.19'
														}
													}
												]
											});
										}}
										onApprove={(data, actions) => {
											return actions.order!.capture().then((details) => {
												console.log({ details });
												const name = details.payer.name!.given_name;
												// alert(`Transaction completed by ${name}`);
											});
										}}
									/>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query
}) => {
	const { id = '' } = query;

	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: `/auth/login?p=/orders/${id}`,
				permanent: false
			}
		};
	}

	const order = await dbOrders.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false
			}
		};
	}

	if (order.user !== session.user._id) {
		return {
			redirect: {
				destination: '/orders/history',
				permanent: false
			}
		};
	}

	return {
		props: {
			order
		}
	};
};

export default OrderPage;
