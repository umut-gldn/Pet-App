import { IonContent, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react'
import { earth, homeOutline, notificationsOutline, personOutline } from 'ionicons/icons'
import React from 'react'
import { Route } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { userState } from '../atoms/user'
import Home from '../pages/Home'
import MyProfile from '../pages/MyProfile'
import Notifications from '../pages/Notifications'
import Search from '../pages/Search'
import UserProfile from '../pages/UserProfile'

const Tabs = () => {
	const [user, setUser] = useRecoilState(userState)
	return (
		user && (
			<IonContent color={'background'}>
				<IonTabs>
					<IonRouterOutlet>
						<Route path="/home" render={() => <Home />} exact={true} />
						<Route path="/search" render={() => <Search />} exact={true} />
						<Route path="/notifications" render={() => <Notifications />} exact={true} />
						<Route path="/me" render={() => <MyProfile />} exact={true} />
						<Route path="/users/:id" render={() => <UserProfile />} />
					</IonRouterOutlet>
					<IonTabBar
						color={'header'}
						slot="bottom"
						style={{
							borderRadius: '20px 20px 0 0'
						}}
					>
						<IonTabButton tab="home" href="/home">
							<IonIcon icon={homeOutline}></IonIcon>
						</IonTabButton>
						<IonTabButton tab="search" href="/search">
							<IonIcon icon={earth}></IonIcon>
						</IonTabButton>
						<IonTabButton tab="notifications" href="/notifications">
							<IonIcon icon={notificationsOutline}></IonIcon>
						</IonTabButton>
						<IonTabButton tab="profile" href="/me">
							<IonIcon icon={personOutline}></IonIcon>
						</IonTabButton>
					</IonTabBar>
				</IonTabs>
			</IonContent>
		)
	)
}

export default Tabs
