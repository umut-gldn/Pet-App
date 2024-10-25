import Request from './api/request'

const req = new Request()

const pets = [
	{
		id: '64bfd5fefc13ae6d735da9b9',
		ownerId: '64bfc454fc13ae6d735da9a5',
		photoURL: 'http://dummyimage.com/106x100.png/ff4444/ffffff',
		ownerName: 'Dayle Prosek',
		name: 'Wolf, timber',
		age: 4,
		gender: 'Female',
		breed: 'Canis lupus lycaon'
	},
	{
		id: '64bfd5fefc13ae6d735da9bb',
		ownerId: '64bfc454fc13ae6d735da9a6',
		photoURL: 'http://dummyimage.com/112x100.png/dddddd/000000',
		ownerName: 'Sebastian MacAdie',
		name: 'Swallow-tail gull',
		age: 5,
		gender: 'Male',
		breed: 'Creagrus furcatus'
	},

	{
		id: '64bfd5fefc13ae6d735da9bf',
		ownerId: '64bfc454fc13ae6d735da9a7',
		photoURL: 'http://dummyimage.com/127x100.png/dddddd/000000',
		ownerName: 'Geoffrey Peche',
		name: 'Common zebra',
		age: 7,
		gender: 'Male',
		breed: 'Equus burchelli'
	},
	{
		id: '64bfd5fefc13ae6d735da9c1',
		ownerId: '64bfc454fc13ae6d735da9a7',
		photoURL: 'http://dummyimage.com/172x100.png/cc0000/ffffff',
		ownerName: 'Maribel Balma',
		name: 'Vine snake (unidentified)',
		age: 8,
		gender: 'Female',
		breed: 'Oxybelis sp.'
	},

	{
		id: '64bfd5fefc13ae6d735da9cb',
		ownerId: '64bfc454fc13ae6d735da9aa',
		photoURL: 'http://dummyimage.com/204x100.png/5fa2dd/ffffff',
		ownerName: 'Seamus Ofener',
		name: 'Grey lourie',
		age: 13,
		gender: 'Male',
		breed: 'Lorythaixoides concolor'
	},

	{
		id: '64bfd5fefc13ae6d735da9cf',
		ownerId: '64bfc454fc13ae6d735da9aa',
		photoURL: 'http://dummyimage.com/179x100.png/cc0000/ffffff',
		ownerName: 'Reinwald Lappine',
		name: 'Sloth bear',
		age: 15,
		gender: 'Bigender',
		breed: 'Melursus ursinus'
	},
	{
		id: '64bfd5fefc13ae6d735da9d1',
		ownerId: '64bfc454fc13ae6d735da9ab',
		photoURL: 'http://dummyimage.com/183x100.png/ff4444/ffffff',
		ownerName: "Niles O'Henehan",
		name: 'Macaw, green-winged',
		age: 16,
		gender: 'Male',
		breed: 'Ara chloroptera'
	}
]

pets.forEach(async pet => {
	await req.addDocument('pets', pet)
})
