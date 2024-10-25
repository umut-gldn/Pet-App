import { IonAvatar, IonButton, IonButtons, IonCol, IonGrid, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonList, IonModal, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { information, pencil, trash } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Request, { PetsCollection } from '../api/request'
import userState from '../atoms/user'
import EditPet from './EditPet'
import PetCard from './PetCard'

const MyPets = () => {
	const [user, setUser] = useRecoilState(userState)
	const [pets, setPets] = useState([])
	const [isInfoOpen, setIsInfoOpen] = useState(false)
	const [isEditPetOpen, setIsEditPetOpen] = useState(false)

	const deletePet = async id => {
		const req = new Request()
		await req.deleteDocument(PetsCollection, id)
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const req = new Request()
				const res = await req.getPets(user.uid)
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
							<IonItemOption color={'primary'}>
								<IonButton onClick={() => setIsInfoOpen(true)} color={'primary'}>
									<IonIcon icon={information} size="medium"></IonIcon>
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
										<IonRow className="ion-align-items-center ion-justify-content-center ion-height">
											<IonCol size="12" size-md="6" size-lg="4">
												<PetCard pet={pet} />
											</IonCol>
										</IonRow>
									</IonGrid>
								</IonModal>
							</IonItemOption>
							<IonItemOption color={'warning'}>
								<EditPet isEditPetOpen={isEditPetOpen} setIsEditPetOpen={setIsEditPetOpen} currentPet={pet} pets={pets} setPets={setPets} />
								<IonButton onClick={() => setIsEditPetOpen(true)} color={'warning'}>
									<IonIcon icon={pencil}></IonIcon>
								</IonButton>
							</IonItemOption>
							<IonItemOption color={'danger'}>
								<IonButton onClick={() => deletePet(pet.id)} color={'danger'}>
									<IonIcon icon={trash}></IonIcon>
								</IonButton>
							</IonItemOption>
						</IonItemOptions>
					</IonItemSliding>
				</div>
			))}
		</IonList>
	)
}

export default MyPets
