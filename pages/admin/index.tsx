import React from 'react';
import { AdminLayout } from '../../components/layouts';
import { DashboardOutlined } from '@mui/icons-material';

const DashboardPage = () => {
	return (
		<AdminLayout
			title="Dashboard"
			subTitle="Estadisticas generales"
			icon={<DashboardOutlined />}
		>
			<h3>Hola Mundo</h3>
		</AdminLayout>
	);
};

export default DashboardPage;
