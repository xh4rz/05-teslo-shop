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
import { AdminLayout } from '../../../components/layouts';
import { CartList, OrderSummary } from '../../../components/cart';
import {
	AirplaneTicketOutlined,
	CreditCardOffOutlined,
	CreditScoreOutlined
} from '@mui/icons-material';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { countries } from '../../../utils';

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
		<AdminLayout
			title="Resumen de la orden"
			subTitle={`OrdenId: ${_id}`}
			icon={<AirplaneTicketOutlined />}
		>
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
									<Chip
										sx={{ my: 2 }}
										label="Pendiente de pago"
										variant="outlined"
										color="error"
										icon={<CreditCardOffOutlined />}
									/>
								)}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { id = '' } = query;

	const order = await dbOrders.getOrderById(id.toString());

	if (!order) {
		return {
			redirect: {
				destination: '/admin/orders',
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
