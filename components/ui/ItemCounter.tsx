import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
	currentValue: number;
	maxValue: number;
	// eslint-disable-next-line no-unused-vars
	updatedQuantity: (newQuantity: number) => void;
}

export const ItemCounter: FC<Props> = ({
	currentValue,
	maxValue,
	updatedQuantity
}) => {
	const addOrRemove = (value: number) => {
		if (value === -1) {
			if (currentValue === 1) return;

			return updatedQuantity(currentValue - 1);
		}

		if (currentValue >= maxValue) return;

		updatedQuantity(currentValue + 1);
	};

	return (
		<Box display="flex" alignItems="center">
			<IconButton onClick={() => addOrRemove(-1)} disabled={currentValue === 1}>
				<RemoveCircleOutline />
			</IconButton>
			<Typography sx={{ width: 40, textAlign: 'center' }}>
				{currentValue}
			</Typography>
			<IconButton
				onClick={() => addOrRemove(+1)}
				disabled={currentValue === maxValue}
			>
				<AddCircleOutline />
			</IconButton>
		</Box>
	);
};
