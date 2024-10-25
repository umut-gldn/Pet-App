import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonIcon, IonToast } from '@ionic/react'
import { heartOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { useRecoilState } from 'recoil'
import Request, { MatchRequest, MatchRequestCollection } from '../api/request'
import userState from '../atoms/user'

const PetCard = ({ pet }) => {
	const history = useHistory()
	const [user] = useRecoilState(userState)
	const [isToastOpen, setIsToastOpen] = useState(false)
	const [isDismissToastOpen, setIsDismissToastOpen] = useState(false)
	const [toastMessage, setToastMessage] = useState('Request is successfully sent!')
	const req = new Request()

	const goProfile = userId => {
		history.push(`/users/${userId}`)
	}

	const deleteMatchRequest = async data => {
		try {
			const snapshot = await req.firestore.collection(MatchRequestCollection).where('from.ownerId', '==', user.uid).where('to.ownerId', '==', pet.ownerId).get()
			snapshot.forEach(async matchRequest => {
				await req.deleteDocument(MatchRequestCollection, matchRequest.id)
			})
		} catch (error) {
			throw error
		}
	}

	useEffect(() => {}, [toastMessage])

	// Assume that every user only has one pet
	const sendMatchRequest = async () => {
		try {
			const matchRequest = new MatchRequest(user.uid, user.photoURL, pet.ownerId, pet.photoURL, 'pending', '')
			const res = await req.addDocument('matchRequests', { ...matchRequest })
			matchRequest.id = res.id
			await req.setDocument('matchRequests', res.id, { ...matchRequest })
		} catch (error) {
			throw error
		}
	}

	return (
		<IonCard>
			<img src={pet.photoURL} alt="pet image" style={{ width: '100vh', height: '250px' }} />
			<IonCardHeader className="ion-padding-bottom">
				<IonCardTitle
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<span>{pet.name}</span>
					{pet.ownerId !== user.uid && (
						<>
							<IonButton
								id="send-match-request"
								color={'danger'}
								size="small"
								onClick={() => {
									sendMatchRequest()
										.then(() => {
											setToastMessage('Request is successfully sent!')
										})
										.catch(() => {
											setToastMessage('Error occurred when sending match request')
										})
										.finally(() => {
											isDismissToastOpen && setIsDismissToastOpen(false)
											setIsToastOpen(true)
										})
								}}
							>
								<IonIcon icon={heartOutline}></IonIcon>
							</IonButton>
							<IonToast
								color={toastMessage === 'Request is successfully sent!' ? 'success' : 'danger'}
								position="top"
								trigger="send-match-request"
								message={toastMessage}
								isOpen={isToastOpen}
								duration={1500}
								buttons={[
									{
										text: 'Dismiss',
										role: 'cancel',
										handler: () => {
											setIsToastOpen(false)
											deleteMatchRequest().then(() => setIsDismissToastOpen(true))
										}
									}
								]}
							></IonToast>
							<IonToast color={'danger'} isOpen={isDismissToastOpen} message={'Request is deleted'} duration={1000} position="top"></IonToast>
						</>
					)}
				</IonCardTitle>
				<IonCardSubtitle>
					<span onClick={() => goProfile(pet.ownerId)}>{pet.ownerName}</span>
				</IonCardSubtitle>
			</IonCardHeader>
			<IonCardContent>
				{pet.info}
				<div className="ion-padding-top">
					<IonChip color={'primary'}>Type: {pet.breed}</IonChip>
					<IonChip color={'tertiary'}> Age: {pet.age}</IonChip>
					{pet.vaccines == 'Tam' ? <IonChip color={'success'}>Vaccines: Tam</IonChip> : <IonChip color={'danger'}>Vaccines: Eksik</IonChip>}
				</div>
			</IonCardContent>
		</IonCard>
	)
}

export default PetCard
