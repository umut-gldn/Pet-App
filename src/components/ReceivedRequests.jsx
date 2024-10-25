import { IonAvatar, IonChip, IonCol, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonRow } from '@ionic/react'
import { checkmarkOutline, closeOutline, heart } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Request, { MatchRequestCollection } from '../api/request'
import userState from '../atoms/user'

const ReceivedRequests = () => {
	const [user] = useRecoilState(userState)
	const [requests, setRequests] = useState([])
	const req = new Request()

	const acceptRequest = async requestId => {
		await req.updateDocument(MatchRequestCollection, requestId, { status: 'accepted' })
		setRequests(requests.filter(request => request.id != requestId))
	}

	const rejectRequest = async requestId => {
		await req.updateDocument(MatchRequestCollection, requestId, { status: 'rejected' })
		setRequests(requests.filter(request => request.id != requestId))
	}

	useEffect(() => {
		const fetchData = async () => {
			const matchRequests = await req.getReceivedMatchRequests(user.uid, 'pending')
			setRequests(matchRequests)
		}
		fetchData()
	}, [requests])

	return requests.map(request => {
		return (
			<IonRow key={request.id}>
				<IonCol className="ion-no-padding">
					<IonItemSliding className="ion-margin-bottom">
						<IonItem
							style={{
								borderRadius: '10px'
							}}
						>
							<IonChip>
								<IonAvatar slot="start">
									<img src={request.from.photo} alt="" />
								</IonAvatar>
								<IonLabel>Pet name</IonLabel>
							</IonChip>
							<IonIcon icon={heart} className="ion-padding-start ion-padding-end" color="danger" size="large"></IonIcon>
							<IonChip>
								<IonAvatar>
									<img src={request.from.photo} alt="" />
								</IonAvatar>
								<IonLabel>Pet Name</IonLabel>
							</IonChip>
						</IonItem>

						<IonItemOptions side="end">
							<IonItemOption color={'danger'}>
								<IonIcon slot="icon-only" icon={closeOutline} onClick={() => rejectRequest(request.id)}></IonIcon>
							</IonItemOption>
							<IonItemOption color={'success'}>
								<IonIcon slot="icon-only" icon={checkmarkOutline} onClick={() => acceptRequest(request.id)}></IonIcon>
							</IonItemOption>
						</IonItemOptions>
					</IonItemSliding>
				</IonCol>
			</IonRow>
		)
	})
}

export default ReceivedRequests
