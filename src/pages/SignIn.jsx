import { IonButton, IonCardContent, IonCol, IonIcon, IonImg, IonInput, IonLabel, IonRow, useIonAlert } from '@ionic/react'
import { logInOutline } from 'ionicons/icons'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import Request from '../api/request'
import { userState } from '../atoms/user'
import NotAuthorized from '../layouts/NotAuthorized'
import logo from '../theme/logo.png'

export const SignIn = () => {
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
				const req = new Request()
				const res = await req.signInWithEmail(data.email, data.password)
				if (res === false) {
					console.log(res)
					alert('HATA', 'kayıt bulunamadı')
					history.push('/register')
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
	const goSignup = () => {
		history.push('/signup')
	}
	const goPasswordReset = () => {
		history.push('/password-reset')
	}
	return (
		<NotAuthorized onSubmit={handleSubmit(onSubmit)}>
			<IonCardContent className="card-content">
				<IonRow class="ion-justify-content-center">
					<IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
						<div className="ion-text-center ">
							<IonImg src={logo} alt="Pet Tinders Logo" />
						</div>
					</IonCol>
				</IonRow>
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonInput label={formatMessage('E-Mail')} type="email" labelPlacement="floating" className=" ion-padding-start ion-padding-end ion-input" {...register('email', { required: true })}></IonInput>
						{errors.email && <IonLabel color="danger">Bu alan gerekli!</IonLabel>}
					</IonCol>
				</IonRow>
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonInput label={formatMessage('Password')} type="password" labelPlacement="floating" className="ion-padding-start ion-padding-end ion-input ion-margin-top" {...register('password', { required: true })} />
						{errors.password && <IonLabel color="danger">Bu alan gerekli!</IonLabel>}
					</IonCol>
				</IonRow>
				<IonRow className="ion-align-items-center">
					<IonCol className="ion-no-padding">
						<IonButton className="ion-margin-top " type="submit" expand="block" color="secondary">
							<span>{formatMessage('Sign In')}</span>
							<IonIcon icon={logInOutline} slot="end"></IonIcon>
						</IonButton>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonCol>
						<a className="ion-float-left " onClick={goPasswordReset} style={{ textDecoration: 'none', color: 'white', fontSize: '12px' }}>
							{formatMessage('Forgot your password ?')}
						</a>
						<a className="ion-float-right" onClick={goSignup} style={{ textDecoration: 'none', color: 'white', fontSize: '12px' }}>
							{formatMessage("Don't have an account ?")}
						</a>
					</IonCol>
				</IonRow>
			</IonCardContent>
		</NotAuthorized>
	)
}
export default SignIn
