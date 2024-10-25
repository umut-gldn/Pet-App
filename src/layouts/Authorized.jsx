import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react'
import React from 'react'

export const Authorized = ({ children }) => {
	return (
		<IonPage>
			<IonContent color={'background'}>
				<IonHeader>
					<IonToolbar
						color={'header'}
						className="ion-text-center logo"
						style={{
							borderRadius: '0 0 20px 20px '
						}}
					>
						<span>Pet Match</span>
					</IonToolbar>
				</IonHeader>
				{children}
			</IonContent>
		</IonPage>
	)
}
export default Authorized
