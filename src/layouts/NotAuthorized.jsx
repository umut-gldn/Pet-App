import { IonCard, IonCol, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonToolbar } from '@ionic/react'
import { React } from 'react'

export const NotAuthorized = ({ onSubmit, children }) => {
	return (
		<IonPage>
			<IonContent color={'tertiary'} scrollY={false}>
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
				<form onSubmit={onSubmit}>
					<IonGrid className="ion-align-items-center ion-justify-content-center ion-height ">
						<IonRow className="ion-align-items-center ion-justify-content-center ion-height">
							<IonCol size="12" size-md="6" size-lg="4">
								<IonCard className="ion-transparent">{children}</IonCard>
							</IonCol>
						</IonRow>
					</IonGrid>
				</form>
			</IonContent>
		</IonPage>
	)
}

export default NotAuthorized
