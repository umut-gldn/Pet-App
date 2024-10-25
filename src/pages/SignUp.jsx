import { IonButton, IonCardContent, IonCol, IonIcon, IonInput, IonLabel, IonRow, useIonAlert } from '@ionic/react'
import { personCircleOutline } from 'ionicons/icons'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import Request from '../api/request'
import { userState } from '../atoms/user'
import NotAuthorized from '../layouts/NotAuthorized'

export const SignUp = () => {
	const history = useHistory()
	const intl = useIntl()
	const formatMessage = (id, values) => intl.formatMessage({ id: id }, { ...values })
	const [user, setUser] = useRecoilState(userState)
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()
	const [presentAlert] = useIonAlert()

	const alert = (title, message) => {
		presentAlert({
			header: title,
			message: message,
			buttons: [formatMessage('Ok')]
		})
	}

	const onSubmit = async data => {
		const fetchData = async () => {
			try {
				console.log(data)
				const req = new Request()
				const res = await req.signUpWithEmail(data.email, data.password, { username: data.username })
				if (res === false) {
					alert('HATA', 'already exists')
					return
				}
				setUser(res)
				history.push('/home')
			} catch (error) {
				alert('HATA', error.message)
			}
		}

		fetchData()
	}

	const goSignIn = () => {
		history.push('/signin')
	}

	return (
		<NotAuthorized onSubmit={handleSubmit(onSubmit)}>
			<IonCardContent className="card-content">
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonInput label={formatMessage('User Name')} type="text" labelPlacement="floating" className="ion-padding-start ion-padding-end ion-margin-top ion-input" {...register('username', { required: true })} />
						{errors.name && <IonLabel color="danger">Bu alan gerekli!</IonLabel>}
					</IonCol>
				</IonRow>
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonInput label={formatMessage('E-Mail')} type="email" labelPlacement="floating" className="ion-padding-start ion-padding-end ion-margin-top ion-input" {...register('email', { required: true })}></IonInput>
						{/* <IonInput type="email" placeholder={formatMessage('E-Mail')} className="ion-padding-start ion-padding-end" {...register('email', { required: true })} /> */}
						{errors.email && <IonLabel color="danger">Bu alan gerekli!</IonLabel>}
					</IonCol>
				</IonRow>
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonInput label={formatMessage('Password')} type="password" labelPlacement="floating" className="ion-padding-start ion-padding-end ion-margin-top ion-input" {...register('password', { required: true })} />
						{errors.password && <IonLabel color="danger">Bu alan gerekli!</IonLabel>}
					</IonCol>
				</IonRow>
				<IonButton className="ion-margin-top " type="submit" expand="block" color="secondary">
					<span>{formatMessage('Sign Up')}</span>
					<IonIcon icon={personCircleOutline} slot="end"></IonIcon>
				</IonButton>
				<IonRow className="ion-text-center">
					<IonCol>
						<a onClick={goSignIn} style={{ textDecoration: 'none', color: 'white', fontSize: '12px' }}>
							{formatMessage('Already have an account?')}
						</a>
					</IonCol>
				</IonRow>
			</IonCardContent>
		</NotAuthorized>
	)
}

export default SignUp
