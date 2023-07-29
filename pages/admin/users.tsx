import { AdminLayout } from '../../components/layouts';
import { PeopleOutline } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IUser } from '../../interfaces';

const UsersPage = () => {
	const { data, error } = useSWR<IUser[]>('/api/admin/users');

	if (!data && !error) return <></>;

	const columns: GridColDef[] = [
		{
			field: 'email',
			headerName: 'Corre',
			width: 250
		},
		{
			field: 'name',
			headerName: 'Nombre completo',
			width: 300
		},
		{
			field: 'role',
			headerName: 'Rol',
			width: 300
		}
	];

	const rows = data!.map(({ _id, email, name, role }) => ({
		id: _id,
		email,
		name,
		role
	}));

	return (
		<AdminLayout
			title={'Usuarios'}
			subTitle={'Mantenimiento de usuarios'}
			icon={<PeopleOutline />}
		>
			<Grid container className="fadeIn">
				<Grid item xs={12} sx={{ height: 650, width: '100%' }}>
					<DataGrid
						columns={columns}
						rows={rows}
						pageSize={10}
						rowsPerPageOptions={[10]}
					/>
				</Grid>
			</Grid>
		</AdminLayout>
	);
};

export default UsersPage;
