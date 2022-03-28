const express = require('express');
const router = express.Router();
const client = require('../config/mongoDb');
const { ObjectId } = require('mongodb');

const db = client.db('BusCounter');
const collection = db.collection('bookings');
const collectionWithDate = db.collection('tripsWithDate');

router.post('/add', (req, res) => {
	console.log(req.body);
	if (req.body.trip_name) {
		collection.insertOne(
			{
				trip_name: req.body.trip_name,
				passenger_name: req.body.passenger_name,
				sit_selected: req.body.sit_selected,
				date: req.body.date,
				time: req.body.time,
				charge: req.body.charge,
				chada: req.body.chada,
				other_charges: req.body.other_charges,
				total: req.body.total,
				status: 'pending',
			},
			(err, result) => {
				if (err) {
					res.send(err);
				} else {
					res.send({ message: 'Trip Booked successfully' });
				}
			}
		);
	} else {
		res.status(400).send({ message: 'Trip name(trip_name) is required' });
	}
});

router.get('/all', (req, res) => {
	collection.find({}).toArray((err, result) => {
		if (err) {
			res.status(400).send(err);
		} else {
			res.send(result);
		}
	});
}
);

router.put('/approve/:id', (req, res) => {
	const id = req.params.id;
	collection.updateOne(
		{ _id: ObjectId(id) },
		{
			$set: {
				status: 'approved',
			},
		},
		(err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.send({ message: 'Trip approved successfully' });
			}
		}
	);
}
);



module.exports = router;
