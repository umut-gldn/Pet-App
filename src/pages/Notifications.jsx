import { IonCol, IonContent, IonGrid, IonLabel, IonRow, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react'
import React, { useState } from 'react'
import ReceivedRequests from '../components/ReceivedRequests'
import SentRequests from '../components/SentRequests'
import Authorized from '../layouts/Authorized'

const Notifications = () => {
	const [segment, setSegment] = useState('sent')
	return (
		<Authorized>
			<IonToolbar className="ion-no-padding" color={'background'}>
				<IonSegment value={segment} onIonChange={e => setSegment(e.detail.value)}>
					<IonSegmentButton value={'sent'}>
						<IonLabel>Sent</IonLabel>
					</IonSegmentButton>
					<IonSegmentButton value={'received'}>
						<IonLabel>Received</IonLabel>
					</IonSegmentButton>
				</IonSegment>
			</IonToolbar>
			<IonContent color="background" className="ion-no-padding">
				<IonGrid className="ion-align-items ion-justify-content-center ion-height ">
					<IonRow className="ion-justify-content-center ion-height">
						<IonCol size="12" size-md="6" size-lg="4">
							{segment === 'sent' ? <SentRequests /> : <ReceivedRequests />}
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonContent>
		</Authorized>
	)
}

export default Notifications
