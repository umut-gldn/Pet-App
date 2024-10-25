import { IonButton, IonCardContent, IonCol, IonIcon, IonInput, IonRow } from '@ionic/react'

import { send } from 'ionicons/icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router'
import Request from '../api/request'
import NotAuthorized from '../layouts/NotAuthorized'

const PasswordReset = () => {
	const history = useHistory()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const intl = useIntl()

	const formatMessage = (id, values) => intl.formatMessage({ id: id }, { ...values })

	const onSubmit = async data => {
		const resetPassword = async () => {
			try {
				const req = new Request()
				const res = await req.resetPasswordWithEmail(data.email)
				if (res === false) {
					alert('Bu emaile ait hesap bulunamadı')
					return
				}
				history.push('/signin')
			} catch (error) {
				throw error
				//alert('HATA', error.message)
			}
		}
		resetPassword()
	}

	return (
		<NotAuthorized onSubmit={handleSubmit(onSubmit)}>
			<IonCardContent className="card-content">
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonInput label={formatMessage('E-Mail')} type="email" labelPlacement="floating" className="ion-padding-start ion-padding-end ion-input" {...register('email', { required: true })}></IonInput>
						{errors.email && <IonLabel color="danger">Bu alan gerekli!</IonLabel>}
					</IonCol>
				</IonRow>
				<IonButton className="ion-margin-top " type="submit" expand="block" color="secondary">
					<span style={{ fontSize: '17px' }}>{formatMessage('Send')}</span>
					<IonIcon icon={send} slot="end" size="small"></IonIcon>
				</IonButton>
			</IonCardContent>
		</NotAuthorized>
	)
}

export default PasswordReset
