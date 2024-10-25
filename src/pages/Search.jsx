import { Geolocation } from '@capacitor/geolocation'
import { GoogleMap } from '@capacitor/google-maps'
import { useEffect, useRef, useState } from 'react'
import Request, { PetsCollection } from '../api/request'
import firebaseConfig from '../config'
import Authorized from '../layouts/Authorized'

export const Search = () => {
	const [coordinate, setCoordinate] = useState({
		latitude: 39.9102,
		longitude: 32.8092
	})

	const mapRef = useRef()
	useEffect(() => {
		const loadMap = async () => {
			const req = new Request()
			const pets = await req.getDocuments(PetsCollection)
			const coordinates = await Geolocation.getCurrentPosition()
			setCoordinate(coordinates.coords)

			const newMap = await GoogleMap.create({
				id: 'map',
				element: mapRef.current,
				apiKey: firebaseConfig.apiKey,
				config: {
					center: {
						lat: coordinates.coords.latitude,
						lng: coordinates.coords.longitude
					},
					zoom: 12
				}
			})

			const markers = [
				{
					coordinate: {
						lat: coordinates.coords.latitude,
						lng: coordinates.coords.longitude
					},
					title: 'Me'
				},

				...pets.map(pet => ({
					coordinate: {
						lat: pet.lat,
						lng: pet.long
					},
					title: pet.name
				}))
			]

			await newMap.addMarkers(markers)
			await newMap.setOnMarkerClickListener(marker => {
				console.log(marker.title)
			})
		}
		loadMap()
	}, [])

	return (
		<Authorized>
			<capacitor-google-map
				ref={mapRef}
				style={{
					display: 'inline-block',
					width: '100vh',
					height: '100vh'
				}}
			></capacitor-google-map>
		</Authorized>
	)
}

export default Search
