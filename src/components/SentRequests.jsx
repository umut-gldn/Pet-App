import { IonAvatar, IonChip, IonCol, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonRow } from '@ionic/react'
import { heart, trash } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Request, { MatchRequestCollection } from '../api/request'
import userState from '../atoms/user'

const SentRequests = () => {
	const [user] = useRecoilState(userState)
	const [requests, setRequests] = useState([])
	const req = new Request()

	const deleteRequest = async requestId => {
		try {
			await req.deleteDocument(MatchRequestCollection, requestId)
			setRequests(requests.filter(request => request.id != requestId))
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			const matchRequests = await req.getSentMatchRequests(user.uid, 'pending')
			setRequests(matchRequests)
		}
		fetchData()
	}, [requests])

	return requests.map(request => {
		return (
			<IonItemSliding key={request.id} className="ion-margin-bottom ">
				<IonRow>
					<IonCol className="ion-no-padding">
						<IonItem
							style={{
								borderRadius: '10px'
							}}
						>
							<IonChip>
								<IonAvatar>
									<img src={request.from.photo} alt="" />
								</IonAvatar>
								<IonLabel>Pet name</IonLabel>
							</IonChip>
							<IonIcon icon={heart} className="ion-padding-start ion-padding-end" color="danger" size="large"></IonIcon>
							<IonChip>
								<IonAvatar>
									<img src={request.to.photo} alt="" />
								</IonAvatar>
								<IonLabel>Pet Name</IonLabel>
							</IonChip>
						</IonItem>
						<IonItemOptions side="end">
							<IonItemOption color={'danger'}>
								<IonIcon slot="icon-only" icon={trash} onClick={() => deleteRequest(request.id)}></IonIcon>
							</IonItemOption>
						</IonItemOptions>
					</IonCol>
				</IonRow>
			</IonItemSliding>
		)
	})
}

export default SentRequests
