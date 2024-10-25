import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { useRecoilState } from 'recoil'
import userState from '../atoms/user'

const EditProfile = ({ isEditProfileOpen, setIsEditProfileOpen }) => {
	const [user, setUser] = useRecoilState(userState)

	return (
		<IonModal isOpen={isEditProfileOpen}>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Edit Profile</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setIsEditProfileOpen(false)}>Close</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>

			<IonContent color={'success'} scrollY={false}>
				<IonGrid className="ion-align-items-center ion-justify-content-center ">
					<IonRow className=" ion-justify-content-center ion-height">
						<IonCol className="ion-text-center">
							<div className="ion-text-center ion-padding-top">
								<img src={user.photoURL} alt="" style={{ borderRadius: '50%' }} />
							</div>
							<IonButton>Edit Profile Photo</IonButton>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</IonModal>
	)
}

export default EditProfile
