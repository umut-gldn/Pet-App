import { Geolocation } from '@capacitor/geolocation'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Request, { PetsCollection } from '../api/request'
import userState from '../atoms/user'
import PetCard from '../components/PetCard'
import Authorized from '../layouts/Authorized'

function distance(lat1, lon1, lat2, lon2) {
	if (lat1 == lat2 && lon1 == lon2) {
		return 0
	} else {
		var radlat1 = (Math.PI * lat1) / 180
		var radlat2 = (Math.PI * lat2) / 180
		var theta = lon1 - lon2
		var radtheta = (Math.PI * theta) / 180
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
		if (dist > 1) {
			dist = 1
		}
		dist = Math.acos(dist)
		dist = (dist * 180) / Math.PI
		dist = dist * 60 * 1.1515
		return dist * 1.609344
	}
}

export const Home = () => {
	const [pets, setPets] = useState([])
	const [user] = useRecoilState(userState)

	useEffect(() => {
		const fetchData = async () => {
			const req = new Request()
			const petsRes = (await req.getDocuments(PetsCollection)).filter(pet => pet.ownerId != user.uid)
			const coordinates = await Geolocation.getCurrentPosition()

			petsRes.sort((a, b) => distance(coordinates.coords.latitude, coordinates.coords.longitude, a.lat, a.long) - distance(coordinates.coords.latitude, coordinates.coords.longitude, b.lat, b.long))
			setPets(petsRes)
		}

		fetchData()
	}, [])

	return (
		<Authorized>
			{pets.map(pet => {
				return <PetCard key={pet.id} pet={pet} />
			})}
		</Authorized>
	)
}

export default Home
