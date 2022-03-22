const express = require('express');
const router = express.Router();
const client = require('../config/mongoDb');
const { ObjectId } = require('mongodb');

const db = client.db('BusCounter');
const collection = db.collection('trips');
const collectionWithDate = db.collection('tripsWithDate');

// Post a trip to the database
router.post('/add', (req, res) => {
	console.log(req.body);
	if (req.body.trip_name) {
		collection.insertOne(
			{
				trip_name: req.body.trip_name,
			},
			(err, result) => {
				if (err) {
					res.send(err);
				} else {
					res.send({ message: 'Trip added successfully' });
				}
			}
		);
	} else {
		res.status(400).send({ message: 'Trip name(trip_name) is required' });
	}
});

// get all trips from the database
router.get('/all', (req, res) => {
	collection.find({}).toArray((err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
});

// Update a trip in the database
router.put('/update/:id', (req, res) => {
	const id = req.params.id;
	collection.updateOne(
		{ _id: ObjectId(id) },
		{
			$set: {
				trip_name: req.body.trip_name,
			},
		},
		(err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.send({ message: 'Trip updated successfully' });
			}
		}
	);
});

// Delete a trip from the database
router.delete('/delete/:id', (req, res) => {
	const id = req.params.id;
	collection.deleteOne({ _id: ObjectId(id) }, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.send({ message: 'Trip deleted successfully' });
		}
	});
});

// Post a trip with date to the database
router.post('/add/date', (req, res) => {
	collectionWithDate.findOne(
		{ trip_date: req.body.trip_date },
		(err, result) => {
			if (err) {
				res.send(err);
			} else {
				if (result) {
					console.log(result);
					if (result.trips.includes(req.body.trip_name)) {
						res.send({ message: 'Trip already exits on this date' });
					} else {
						collectionWithDate.findOneAndUpdate(
							{ trip_date: req.body.trip_date },
							{
								$set: {
									trips: [...result.trips, req.body.trip_name],
								},
							},
							(err, result) => {
								if (err) {
									res.send(err);
								} else {
									res.send(result);
								}
							}
						);
					}
				} else {
					collectionWithDate.insertOne(
						{
							trip_date: req.body.trip_date,
							trips: [req.body.trip_name],
						},
						(err, result) => {
							if (err) {
								res.send(err);
							} else {
								res.send({ message: 'Trip added successfully' });
							}
						}
					);
				}
			}
		}
	);
});

// Get all trips with date
router.get('/all/date', (req, res) => {
	collectionWithDate.find({}).toArray((err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
});

// delete a trip with date from the database
router.delete('/delete/date/:id', (req, res) => {
	const id = req.params.id;
	collectionWithDate.findOneAndDelete(
		{ _id: ObjectId(id) },
		(err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.send({ message: 'Trip deleted successfully' });
			}
		}
	);
});

// Update a trip with date in the database
router.put('/update/date/:id', (req, res) => {
	const id = req.params.id;
	collectionWithDate.findOneAndUpdate(
		{ _id: ObjectId(id) },
		{
			$set: {
				trip_date: req.body.trip_date,
				trips: [...req.body.trips],
			},
		},
		(err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.send({ message: 'Trip updated successfully' });
			}
		}
	);
});


module.exports = router;
