import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import { cloudUploadOutline } from 'ionicons/icons'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useRecoilState } from 'recoil'
import catTypes from '../api/catTypes'
import Request, { PetsCollection } from '../api/request'
import userState from '../atoms/user'

const defaultCat = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAAB6CAMAAADkgxNVAAAAeFBMVEX////39/f09PQAAAALAAAYEg4cFhMFAAAeGBX8/PwWDwvs7Ozp6egaFBHj4+MfGhfb2toRCACFhIOtrKx5eHfFxMTPzs67urlpZ2aSkZBzcXBkYmHU1NOMiom1tLM5NzZPTEswLSxCPz1YVlWdnJwpJycfHR2lpKMFIjdMAAAHB0lEQVR4nO2b6ZaqOBCAhUpYAgGCbIrKqrz/G04W0G7bnrlD0pc7Z6w/YuhTfJ2k1uAusP50CXb27k8X681oRN6MZuTNaEbejGbkzWhG3oxm5M1oRt6MZuTNaEbejGbk/8lo54djVddVuj9ZZjSaZvQnBoAYYQgAaFWawDTMaNVAMShBmCLUXfT1G2ZMIYbmcCnzspyOHQjgIdJVapbxBB4cHl+TtAGPQamp1SzjAUj7aSBMgVD3oqfVLGOFYP80VDTIgVxLq1nGI8D4PBY2BDdae9Is4x5w5z8PRjGGWkerWcaoo6zPo6QouRTBPJpzS9JZbcO+ZwKHoO5KhH8k/bFQo0fEqi/T++tiOs6MFAjGPMwghjGCTGpPXMdN1us0Hq+TrO+6fqjroSEohkHO38C+2tKvy0/kPUEgwaziyKPOWVxenv3mv5Kfzc1G12Mn/pnE9Bqu1vLD+SNf5JR/2C3BxWoleoxWEr22VytKpN4CnJh/+BVD66O2FmPZXrt2DL6Mh2PbXVsRpYMGS4vOEHoOkr+HsZBuBpzxswp7dACLG4nIJ4l036mLpk0Yj4g2DWAKzWnn22EURSFXVvTgYLdpHDfji3xUqdlWjH6PoQinDhxGz9nQIWBdm50R8+C6D0tGBmvnZ0gy8rVen6BpMRIQjmW6MQ8hgh1KMUHc29z23JByl9TWMo9WzdD6iK2z1hUDOTmnHpDr0tvtRsFF0MuwdwF29Jf9yH0P2cb3nNFcGFjpcRRZjh8U4/FgLTd5+At6adfRFW/kwy+PdObhJZcBPoF8kSNuP5bwALhf/RgtxhPF/XezY1MH+L0SSMO/jeAeVz9Gi9FvuGF/c68ASvlHBjKp4CFxvQvXizOcIP3mVgrCPVq9XPEAO2yr/DEHen3dLOExUDibgtEmFGWO8JWrRYsxaKgqVOxo0TJf5dxIAlFvoznYaKS4eozWQKSHDK/QqMwibEDWqdxWhp2sZfn/EDkOaCy1HmMYUyYMO+P5diZH0vkqueKOs0aZmL8zL780EHX3o3p4xovThVFd8cDCluBnc/PXsGpNxhEUWtTA7CjDHnrZk8jc+xbMidybGzGmS+skSBYtwUldjcoxCimRllXr+8fvFnF6uM7TjV51TEaP8fDRh5f1sX7kX3yK743IlsD6BHenyfipbN7Dh8Ze1NFHa3TUqq51ffiVfgjY2WPmgoax9r4HI0/mF6tFi9E/IpTdv9n3Q4S8Rx87ZfZANuybncD7mixYfG3xpx2Yuh+75P9aNPsUA1KJYTElS3Kbtxz8+qni53XDhr29gjk3UQvcgFb7k20nUwXEm0uauySAGw0vrtvvqZjIE6MOOUydHDHPvU1Pk2bHmGh0xHUZc3BcroEvMDDsOJi5UH112L2W0Wj3zfjjpVfkq9x4XnMcX01YhUDjjEabceT2oK58Owjs16bBg6ZGpNFmLAhu/9EeDqDjfLQZw05ms38v05zErRNtxuhXGPeySlwr2owir3ipIky7u52Um/UAhPg88Tq/vFMBDMv1ZVPGPS9gXpqMf3Ocq33/qw3XOmqo+7p0Dm9efE8hN2VMAXevFSTYi90lS9+SMeErPc+VdagPl/x0Wmy8cOPYIXNqWwKqtmLMXFbPie2BlwpA4ts1VaEmBy+OF3MqtjuLi2JnqRWCq0NdRohHQc1kCXFMnbkgTBhu1j9H7wzp0SQZwWmyemidWPbx+RZ0WTYQpF4ACHt8W1++ajE+imjRaBRZQ9BRV83jiGDMIVb5jjU8Wiu/mfGRKhTggFQXU6bcZSYq2TN45KS+bXQW9yFVyFXfe2czSiWjX4mDGXuJQtyi1ic+uvuxVVcRd0JCUQA0loxWjyHZBZxR7oYJ0Hdd6R9mTDD11MpacwnNGa9yxGYe+NzFO+rceg9ovRPXYrT7+8FCqhopIVAVdyKxQQOHzjXCtBmjMIx5m50VYwSzIyyBDeLoqFG3D+ButB95zoVV8ujPa80r6d5WUHwj5qorLi3I3ciudxahcBTBcJxt5rRkvBVyJ07sgJpV17mtL7A1854JPNaPU01UGzyoCatFvFYveXDPztoyKQ43/q+sf4hujissVzQnQLa8az6dck3DRlY5JffhonnhseuGfYrd1AG43GqFGp6UE5Xx2j2hIsDsERBC0NzI34pxF12ybJIBz5/f5tkpI5FeJ8napq8v250rPOviFrT0a9MXb2uu1muSkVF30Za5en36T3oNMorz7LmkDhuq8ZLHkxh93+zAbSYtTqdi35BvOgNrxChjcHM9YeUA2NFp5j2J2ff2woH7SiJ+rOCZQzT9bqFdZkPbDtWk/QOAD/ID7z/6GkcIL+X/+Rsf8/JmNCNvRjPyZjQjb0Yz8mY0I29GM/JmNCP/DUZDP+T+QbF2gf2nS/AXnsxj4sG58DcAAAAASUVORK5CYII='

const EditPet = ({ isEditPetOpen, setIsEditPetOpen, currentPet, pets, setPets }) => {
	const req = new Request()
	const { register, handleSubmit } = useForm()
	const [downloadURL, setDownloadURL] = useState(null)
	const [loading, setLoading] = useState(false)
	const [pet, setPet] = useState(currentPet)
	const [user] = useRecoilState(userState)
	const upload = useRef()

	const intl = useIntl()
	const formatMessage = (id, values) => intl.formatMessage({ id: id }, { ...values })

	const handleFileUpload = async e => {
		const file = e.target.files[0]
		try {
			setLoading(true)
			const downloadURL = await req.uploadFile(`${user.uid}/pets`, file)
			setDownloadURL(downloadURL)
			setPet({ ...pet, photoURL: downloadURL })
			setLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	const click = () => {
		upload.current.click()
	}

	const editPet = async data => {
		data = { ...data, ...pet }
		await req.setDocument(PetsCollection, pet.id, data)
		pets[pets.findIndex(p => p.id === pet.id)] = data
		setPets(pets)
		setIsEditPetOpen(false)
	}

	return (
		<IonModal isOpen={isEditPetOpen}>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Edit Pet</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setIsEditPetOpen(false)}>Close</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-no-margin">
				<form onSubmit={handleSubmit(editPet)}>
					<IonList lines="full">
						<IonItem>
							<IonRow>
								<IonCol>
									<img src={downloadURL || pet.photoURL ? downloadURL || pet.photoURL : defaultCat} alt="" style={{ width: '100px', borderRadius: '50%' }} />
								</IonCol>
							</IonRow>
							{!downloadURL && !loading && (
								<div onClick={() => click()}>
									<div>
										<IonButton>
											Edit Pet Image
											<IonIcon icon={cloudUploadOutline} slot="end"></IonIcon>
										</IonButton>
										<input style={{ display: 'none' }} type="file" onChange={handleFileUpload} ref={upload} />
									</div>
								</div>
							)}
							{downloadURL && (
								<div onClick={() => click()}>
									<IonButton>
										Edit Pet Image
										<IonIcon icon={cloudUploadOutline} slot="end"></IonIcon>
									</IonButton>
									<input style={{ display: 'none' }} type="file" onChange={handleFileUpload} ref={upload} />
								</div>
							)}
						</IonItem>
						<IonItem>
							<IonInput
								value={pet.name}
								type="text"
								{...register('name', { required: true, value: pet.name })}
								onIonInput={e => {
									console.log({ ...pet, name: e.detail.value })
									setPet({ ...pet, name: e.detail.value })
								}}
							></IonInput>
						</IonItem>
						<IonItem>
							<IonLabel
								style={{
									color: '#8e8e8e'
								}}
							>
								Breed
							</IonLabel>
							<IonSelect value={pet.breed} {...register('breed', { required: true, value: pet.breed })} interface="action-sheet" onIonChange={e => setPet({ ...pet, type: e.detail.value })}>
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
							<IonSelect value={pet.gender} {...register('gender', { required: true, value: pet.gender })} interface="action-sheet" onIonChange={e => setPet({ ...pet, gender: e.detail.value })}>
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
							<IonSelect value={pet.vaccines} {...register('vaccines', { required: true, value: pet.vaccines })} interface="action-sheet" onIonChange={e => setPet({ ...pet, vaccines: e.detail.value })}>
								<IonSelectOption value={'Tam'}>Tam</IonSelectOption>
								<IonSelectOption value={'Eksik'}>Eksik</IonSelectOption>
							</IonSelect>
						</IonItem>
						<IonItem>
							<IonInput value={pet.age} placeholder={formatMessage('Age')} aria-label={formatMessage('Age')} type="number" {...register('age', { required: true, value: pet.age })} onIonInput={e => setPet({ ...pet, age: e.detail.value })}></IonInput>
						</IonItem>
						<IonItem>
							<IonInput value={pet.info} placeholder={formatMessage('Info')} aria-label={formatMessage('Info')} type="text" {...register('info', { required: true, value: pet.info })} onIonInput={e => setPet({ ...pet, info: e.detail.value })}></IonInput>
						</IonItem>
					</IonList>
					<IonButton type="submit" expand="block">
						Edit
					</IonButton>
				</form>
			</IonContent>
		</IonModal>
	)
}

export default EditPet
