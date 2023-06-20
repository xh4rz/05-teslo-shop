import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '../../components/layouts';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
	{
		field: 'id',
		headerName: 'ID',
		width: 100
	},
	{
		field: 'fullname',
		headerName: 'Nombre Completo',
		width: 300
	},
	{
		field: 'paid',
		headerName: 'Pagada',
		description: 'Muestra información si está pagada la orden o no',
		width: 200,
		renderCell: (params: GridRenderCellParams) => {
			return params.row.paid ? (
				<Chip color="success" label="Pagada" variant="outlined" />
			) : (
				<Chip color="error" label="No Pagada" variant="outlined" />
			);
		}
	},
	{
		field: 'orden',
		headerName: 'Ver orden',
		width: 200,
		sortable: false,
		renderCell: (params: GridRenderCellParams) => {
			return (
				<NextLink href={`/orders/${params.row.orderId}`} passHref>
					<Link underline="always">Ver orden</Link>
				</NextLink>
			);
		}
	}
];

interface Props {
	orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
	console.log(orders);
	const rows = orders.map(
		({ _id, isPaid, shippingAddress: { firstName, lastName } }, index) => ({
			id: index + 1,
			orderId: _id,
			paid: isPaid,
			fullname: `${firstName} ${lastName}`
		})
	);

	return (
		<ShopLayout
			title="Historial de ordenes"
			pageDescription="Historial de ordenes del cliente"
		>
			<Typography variant="h1" component="h1">
				Historial de ordenes
			</Typography>

			<Grid container>
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						columns={columns}
						rows={rows}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</ShopLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const session = await getSession({ req });

	if (!session) {
		return {
			redirect: {
				destination: '/auth/login?p=/orders/history',
				permanent: false
			}
		};
	}

	const orders = await dbOrders.getOrdersByUser(session.user._id);

	return {
		props: {
			orders
		}
	};
};

export default HistoryPage;
