import { IonAvatar, IonButton, IonButtons, IonCol, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { heart, information } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import Request, { MatchRequest, MatchRequestCollection } from '../api/request'
import PetCard from './PetCard'

const UserPets = ({ user }) => {
	const [pets, setPets] = useState([])
	const [isInfoOpen, setIsInfoOpen] = useState(false)
	const req = new Request()

	const sendMatchRequest = async pet => {
		try {
			const matchRequest = new MatchRequest(user.uid, user.photoURL, pet.ownerId, pet.photoURL, 'pending', '')
			const res = await req.addDocument(MatchRequestCollection, { ...matchRequest })
			matchRequest.id = res.id
			await req.setDocument(MatchRequestCollection, res.id, { ...matchRequest })
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await req.getPets(user.id)
				setPets(res)
			} catch (error) {
				console.log(error)
			}
		}

		fetchData()
	}, [pets])

	return (
		<IonList>
			{pets.map(pet => (
				<div key={pet.id}>
					<IonItemSliding>
						<IonItem>
							<IonAvatar className="ion-no-padding">
								<img src={pet.photoURL} alt="" />
							</IonAvatar>
							<span style={{ marginLeft: '1rem' }}>{pet.name}</span>
						</IonItem>
						<IonItemOptions>
							<IonItemOption color={'success'}>
								<IonButton onClick={() => setIsInfoOpen(true)} color={'success'}>
									<IonIcon icon={information}></IonIcon>
								</IonButton>
								<IonModal isOpen={isInfoOpen}>
									<IonHeader>
										<IonToolbar>
											<IonButtons slot="end">
												<IonTitle>{pet.name}</IonTitle>
												<IonButton onClick={() => setIsInfoOpen(false)}>Close</IonButton>
											</IonButtons>
										</IonToolbar>
									</IonHeader>
									<IonGrid className="ion-align-items-center ion-justify-content-center ion-height">
										<IonRow className="ion-align-items-center ion-justify-content-center ion-height ">
											<IonCol size="12" size-md="6" size-lg="4">
												<PetCard pet={pet} />
											</IonCol>
										</IonRow>
									</IonGrid>
								</IonModal>
							</IonItemOption>
							<IonItemOption color={'danger'}>
								<IonButton onClick={() => sendMatchRequest(pet)} color={'danger'}>
									<IonIcon icon={heart}></IonIcon>
								</IonButton>
							</IonItemOption>
						</IonItemOptions>
					</IonItemSliding>
				</div>
			))}
		</IonList>
	)
}

export default UserPets
