import React from 'react';
import { AdminLayout } from '../../components/layouts';
import { ConfirmationNumberOutlined } from '@mui/icons-material';

const orders = () => {
	return (
		<AdminLayout
			title={'Ordenes'}
			subTitle={'Mantenimiento de ordenes'}
			icon={<ConfirmationNumberOutlined />}
		>
			Ordenes
		</AdminLayout>
	);
};

export default orders;
