import { IonButton, IonFab, IonFabButton, IonFabList, IonIcon, IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import { addOutline, logOutOutline, pencilOutline, settingsOutline, shield, trashOutline } from 'ionicons/icons'
import { useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { useRecoilState } from 'recoil'
import Request, { MatchRequestCollection, PetsCollection, UsersCollection } from '../api/request'
import { userState } from '../atoms/user'
import AddPet from '../components/AddPet'
import MyPets from '../components/MyPets'
import Authorized from '../layouts/Authorized'

const defaultImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUtMHFQmELtQP7GiQrvpYQQVYIU_2ZoF-n-I3CqhOs9qaetDVhykH1PSmMSlfD5nCklxY&usqp=CAU'

export const MyProfile = () => {
	const history = useHistory()
	const req = new Request()

	const [user, setUser] = useRecoilState(userState)
	const [downloadURL, setDownloadURL] = useState(null)
	const [lastSegment, setLastSegment] = useState('pets')
	const [isAddPetOpen, setIsAddPetOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const upload = useRef()
	const verifyUpload = useRef()

	const handleVerifyUpload = async e => {
		const file = e.target.files[0]
		try {
			const verifyUrl = await req.uploadFile(user.uid, file)
			await req.setDocument(UsersCollection, user.uid, {
				...user,
				verified: false,
				verifyPhoto: verifyUrl
			})
			setUser({
				...user,
				verified: false,
				verifyPhoto: verifyUrl
			})
		} catch (error) {
			console.error(error)
		}
	}

	const verify = async () => {
		await req.updateDocument(UsersCollection, user.uid, {
			verified: true
		})

		setUser({
			...user,
			verified: true
		})
	}

	const handleUpload = async e => {
		const file = e.target.files[0]
		try {
			setLoading(true)
			const downloadURL = await req.uploadFile(user.uid, file)
			console.log(downloadURL)
			await req.setDocument(UsersCollection, user.uid, { ...user, photoURL: downloadURL })
			setDownloadURL(downloadURL)
			setUser({
				...user,
				photoURL: downloadURL
			})
			setLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	const click = () => {
		upload.current.click()
	}

	const verifyClick = () => {
		verifyUpload.current.click()
	}

	const signOut = async () => {
		const res = await req.signOut()
		setUser(res)
		history.push('/home')
	}

	const deleteAccount = async () => {
		await req.deleteDocument(UsersCollection, user.uid)

		await req.firestore
			.collection(PetsCollection)
			.where('ownerId', '==', user.uid)
			.get()
			.docs.forEach(async pet => {
				await req.deleteDocument(PetsCollection, pet.id)
			})

		await req
			.getDocuments(MatchRequestCollection)
			.filter(matchRequest => {
				return matchRequest.from.ownerId == user.uid || matchRequest.to.ownerId == user.uid
			})
			.forEach(async matchRequest => {
				await req.deleteDocument(MatchRequestCollection, matchRequest.id)
			})

		const res = await req.auth.currentUser.delete()
		setUser(res)
	}

	return (
		<Authorized>
			<div className="ion-padding-top">
				<div className="ion-text-center ion-margin-bottom">{user.username}</div>
				<div
					className=" ion-text-center ion-margin-bottom"
					style={{
						position: 'relative'
					}}
				>
					<img src={user && user.photoURL ? user.photoURL : defaultImg} alt="" style={{ position: 'relative', borderRadius: '50%', width: '50%', height: '50%' }} />
					<IonFab slot="fixed" horizontal="right" vertical="bottom">
						<IonFabButton
							size="small"
							color={'danger'}
							style={{
								zIndex: '2',
								position: 'absolute',
								right: '22%',
								bottom: '1%',
								margin: 'auto'
							}}
							onClick={() => click()}
						>
							<IonIcon icon={pencilOutline}></IonIcon>

							<div hidden={true}>
								Fotoğraf Yükle
								<input type="file" onChange={handleUpload} ref={upload} style={{ display: 'none' }} />
							</div>
						</IonFabButton>
					</IonFab>
				</div>
				<div className="ion-margin-bottom">
					<IonToolbar color={'transparent'} className="ion-no-margin">
						<IonSegment value={lastSegment} onIonChange={e => setLastSegment(e.detail.value)}>
							<IonSegmentButton value="pets">
								<IonLabel>Pets</IonLabel>
							</IonSegmentButton>
							<IonSegmentButton value="favorites">
								<IonLabel>History</IonLabel>
							</IonSegmentButton>
						</IonSegment>
					</IonToolbar>
				</div>
				{lastSegment == 'pets' ? <MyPets user={user} /> : <div>History</div>}
				<AddPet isAddPetOpen={isAddPetOpen} setIsAddPetOpen={setIsAddPetOpen} />

				<IonFab slot="fixed" vertical="bottom" horizontal="start">
					<IonFabButton onClick={() => setIsAddPetOpen(true)}>
						<IonIcon icon={addOutline}></IonIcon>
					</IonFabButton>
				</IonFab>

				<IonFab slot="fixed" vertical="bottom" horizontal="end">
					<IonFabButton>
						<IonIcon icon={settingsOutline}></IonIcon>
					</IonFabButton>
					<IonFabList side="top">
						<IonFabButton color={'primary'} onClick={signOut}>
							<IonIcon icon={logOutOutline}></IonIcon>
						</IonFabButton>
						<IonFabButton color={'danger'} onClick={deleteAccount}>
							<IonIcon icon={trashOutline}></IonIcon>
						</IonFabButton>
					</IonFabList>
				</IonFab>

				<IonButton onClick={() => verifyClick()} color={user.verified ? 'primary' : 'danger'}>
					<IonIcon icon={shield} color={user.verified ? 'white' : 'success'}></IonIcon>
					<div hidden={true}>
						Fotoğraf Yükle
						<input type="file" onChange={handleVerifyUpload} ref={verifyUpload} />
					</div>
				</IonButton>

				<IonButton onClick={verify}>Verify</IonButton>
			</div>
		</Authorized>
	)
}

export default MyProfile
