import { ShopLayout } from '../../components/layouts/ShopLayout';
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@mui/material';
import { countries } from '../../utils';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../context';
import { useContext, useEffect } from 'react';

type FormData = {
	firstName: string;
	lastName: string;
	address: string;
	address2?: string;
	zip: string;
	city: string;
	country: string;
	phone: string;
};

const getAddressFromCookies = (): FormData => {
	return {
		firstName: Cookies.get('firstName') || '',
		lastName: Cookies.get('lastName') || '',
		address: Cookies.get('address') || '',
		address2: Cookies.get('address2') || '',
		zip: Cookies.get('zip') || '',
		city: Cookies.get('city') || '',
		country: Cookies.get('country') || countries[0].code,
		phone: Cookies.get('phone') || ''
	};
};

const AddressPage = () => {
	const router = useRouter();

	const { updateAddress } = useContext(CartContext);

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		reset
	} = useForm<FormData>({
		defaultValues: {
			firstName: '',
			lastName: '',
			address: '',
			address2: '',
			zip: '',
			city: '',
			country: '',
			phone: ''
		}
	});

	const onsubmitAddress = (data: FormData) => {
		updateAddress(data);
		router.push('/checkout/summary');
	};

	useEffect(() => {
		reset(getAddressFromCookies());
	}, [reset]);

	return (
		<ShopLayout
			title="Dirección"
			pageDescription="Confirmar dirección del destino"
		>
			<form onSubmit={handleSubmit(onsubmitAddress)}>
				<Typography variant="h1" component="h1">
					Dirección
				</Typography>
				<Grid container spacing={2} sx={{ mt: 2 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Nombre"
							variant="filled"
							fullWidth
							{...register('firstName', {
								required: 'Este campo es requerido'
							})}
							error={!!errors.firstName}
							helperText={errors.firstName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Apellido"
							variant="filled"
							fullWidth
							{...register('lastName', {
								required: 'Este campo es requerido'
							})}
							error={!!errors.lastName}
							helperText={errors.lastName?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Dirección"
							variant="filled"
							fullWidth
							{...register('address', {
								required: 'Este campo es requerido'
							})}
							error={!!errors.address}
							helperText={errors.address?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Dirección 2 (opcional)"
							variant="filled"
							fullWidth
							{...register('address2')}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Código Postal"
							variant="filled"
							fullWidth
							{...register('zip', {
								required: 'Este campo es requerido'
							})}
							error={!!errors.zip}
							helperText={errors.zip?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Ciudad"
							variant="filled"
							fullWidth
							{...register('city', {
								required: 'Este campo es requerido'
							})}
							error={!!errors.city}
							helperText={errors.city?.message}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						{/* <FormControl fullWidth error={!!errors.country}>
							<TextField
								select
								variant="filled"
								label="País"
								defaultValue={Cookies.get('country') || countries[0].code}
								{...register('country', {
									required: 'Este campo es requerido'
								})}
								error={!!errors.country}
								helperText={errors.country?.message}
							>
								<MenuItem value="">
									<em>Seleccione un País</em>
								</MenuItem>
								{countries.map((country) => (
									<MenuItem key={country.code} value={country.code}>
										{country.name}
									</MenuItem>
								))}
							</TextField>
						</FormControl> */}

						<FormControl fullWidth error={!!errors.country}>
							<InputLabel>País</InputLabel>
							<Controller
								control={control}
								name="country"
								rules={{ required: 'Este campo es requerido' }}
								render={({ field }) => (
									<Select variant="filled" label="País" {...field}>
										<MenuItem value="">
											<em>Seleccione un País</em>
										</MenuItem>
										{countries.map((country) => (
											<MenuItem key={country.code} value={country.code}>
												{country.name}
											</MenuItem>
										))}
									</Select>
								)}
							/>
							{errors.country && (
								<FormHelperText>{errors.country?.message}</FormHelperText>
							)}
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Teléfono"
							variant="filled"
							fullWidth
							{...register('phone', {
								required: 'Este campo es requerido'
							})}
							error={!!errors.phone}
							helperText={errors.phone?.message}
						/>
					</Grid>
				</Grid>
				<Box sx={{ mt: 5 }} display="flex" justifyContent="center">
					<Button
						color="secondary"
						className="circular-btn"
						size="large"
						type="submit"
					>
						Revisar pedido
					</Button>
				</Box>
			</form>
		</ShopLayout>
	);
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
// 	const { token = '' } = req.cookies;

// 	let isValidToken = false;

// 	try {
// 		await jwt.isValidToken(token);
// 		isValidToken = true;
// 	} catch (error) {
// 		isValidToken = false;
// 	}

// 	if (!isValidToken) {
// 		return {
// 			redirect: {
// 				destination: '/auth/login?p=/checkout/address',
// 				permanent: false
// 			}
// 		};
// 	}

// 	return {
// 		props: {}
// 	};
// };

export default AddressPage;
