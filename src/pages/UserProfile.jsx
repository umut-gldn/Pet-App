import { IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Request, { UsersCollection } from '../api/request'
import UserPets from '../components/UserPets'
import Authorized from '../layouts/Authorized'

const defaultImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUtMHFQmELtQP7GiQrvpYQQVYIU_2ZoF-n-I3CqhOs9qaetDVhykH1PSmMSlfD5nCklxY&usqp=CAU'

export const UserProfile = () => {
	let { id } = useParams()
	const [user, setUser] = useState({})

	useEffect(() => {
		const fetchData = async () => {
			const req = new Request()
			const res = await req.getDocument(UsersCollection, id)
			setUser(res)
		}

		fetchData()
	}, [user])

	const [lastSegment, setLastSegment] = useState('pets')

	return (
		<Authorized>
			<div className="ion-padding-top">
				<div className="ion-text-center ion-margin-bottom">
					<span>{user.userName}</span>
				</div>
				<div className="ion-text-center ion-margin-bottom">
					<img src={user && user.photoURL ? user.photoURL : defaultImg} alt="" style={{ borderRadius: '50%', width: '50%' }} />
				</div>

				<div className="ion-margin-bottom">
					<IonToolbar color={'transparent'} className="ion-no-margin">
						<IonSegment onIonChange={e => setLastSegment(e.detail.value)}>
							<IonSegmentButton value="pets">
								<IonLabel>Pets</IonLabel>
							</IonSegmentButton>
							<IonSegmentButton value="favorites">
								<IonLabel>History</IonLabel>
							</IonSegmentButton>
						</IonSegment>
					</IonToolbar>
				</div>
				{lastSegment === 'pets' ? <UserPets user={user} /> : <div>History</div>}
			</div>
		</Authorized>
	)
}

export default UserProfile
