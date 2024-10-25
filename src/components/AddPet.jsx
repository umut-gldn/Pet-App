import { Geolocation } from '@capacitor/geolocation'
import { IonButton, IonButtons, IonCol, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import { cloudUploadOutline } from 'ionicons/icons'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useRecoilState } from 'recoil'
import catTypes from '../api/catTypes'
import Request, { Pet, PetsCollection } from '../api/request'
import userState from '../atoms/user'

const AddPet = ({ isAddPetOpen, setIsAddPetOpen }) => {
	const req = new Request()

	const [user, setUser] = useRecoilState(userState)
	const [downloadURL, setDownloadURL] = useState(null)
	const [loading, setLoading] = useState(false)
	const upload = useRef()

	const intl = useIntl()
	const formatMessage = (id, values) => intl.formatMessage({ id: id }, { ...values })
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm()

	const addPet = async newPet => {
		const pet = new Pet(newPet.name, user.uid, user.username, newPet.age, newPet.breed, newPet.gender, newPet.info, newPet.vaccines)

		pet.photoURL = downloadURL
		const location = await Geolocation.getCurrentPosition()
		pet.lat = location.coords.latitude
		pet.long = location.coords.longitude
		const res = await req.addDocument(PetsCollection, { ...pet })
		pet.id = res.id
		await req.setDocument(PetsCollection, res.id, { ...pet })
		reset()
	}
	const handleFileUpload = async e => {
		const file = e.target.files[0]
		try {
			setLoading(true)
			const downloadURL = await req.uploadFile(`${user.uid}/pets`, file)
			setDownloadURL(downloadURL)
			setLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	const click = () => {
		upload.current.click()
	}

	return (
		<IonModal isOpen={isAddPetOpen}>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Add Pet</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setIsAddPetOpen(false)}>Close</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonGrid className="ion-no-margin">
				<IonRow>
					<IonCol>
						<form onSubmit={handleSubmit(addPet)}>
							<IonList lines="full">
								<IonItem>
									{!downloadURL && !loading && (
										<div onClick={() => click()}>
											<div>
												<IonButton>
													Add Pet Image
													<IonIcon icon={cloudUploadOutline} slot="end"></IonIcon>
												</IonButton>
												<input style={{ display: 'none' }} type="file" onChange={handleFileUpload} ref={upload} />
											</div>
										</div>
									)}
									{downloadURL && (
										<div>
											<IonRow>
												<IonCol>
													<img src={downloadURL} alt="" style={{ width: '100px', borderRadius: '50%' }} />
												</IonCol>
											</IonRow>

											<div onClick={() => click()}>
												<IonButton>
													Add Pet Image
													<IonIcon icon={cloudUploadOutline} slot="end"></IonIcon>
												</IonButton>
												<input style={{ display: 'none' }} type="file" onChange={handleFileUpload} ref={upload} />
											</div>
										</div>
									)}
								</IonItem>
								<IonItem>
									<IonInput placeholder={formatMessage('Name')} aria-label={formatMessage('Name')} type="text" {...register('name', { required: true })}></IonInput>
								</IonItem>
								<IonItem>
									<IonLabel
										style={{
											color: '#8e8e8e'
										}}
									>
										{formatMessage('Type')}
									</IonLabel>
									<IonSelect {...register('breed', { required: true })} interface="action-sheet">
										{catTypes.map(type => {
											return (
												<IonSelectOption key={type} value={type}>
													{type}
												</IonSelectOption>
											)
										})}
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel
										style={{
											color: '#8e8e8e'
										}}
									>
										{formatMessage('Gender')}
									</IonLabel>
									<IonSelect {...register('gender', { required: true })} interface="action-sheet">
										<IonSelectOption value={'Erkek'}>Erkek</IonSelectOption>
										<IonSelectOption value={'Dişi'}>Dişi</IonSelectOption>
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonLabel
										style={{
											color: '#8e8e8e'
										}}
									>
										{formatMessage('Vaccines')}
									</IonLabel>
									<IonSelect {...register('vaccines', { required: true })} interface="action-sheet">
										<IonSelectOption value={'Tam'} color="success">
											Tam
										</IonSelectOption>
										<IonSelectOption value={'Eksik'} color="danger">
											Eksik
										</IonSelectOption>
									</IonSelect>
								</IonItem>
								<IonItem>
									<IonInput placeholder={formatMessage('Age')} aria-label={formatMessage('Age')} type="number" {...register('age', { required: true })}></IonInput>
								</IonItem>
								<IonItem>
									<IonInput placeholder={formatMessage('Info')} aria-label={formatMessage('Info')} type="text" {...register('info', { required: true })}></IonInput>
								</IonItem>
							</IonList>
							<IonButton className="ion-margin-top " type="submit" expand="block" color="secondary" onClick={() => setIsAddPetOpen(false)}>
								<span>{formatMessage('Add')}</span>
							</IonButton>
						</form>
					</IonCol>
				</IonRow>
			</IonGrid>
		</IonModal>
	)
}

export default AddPet
