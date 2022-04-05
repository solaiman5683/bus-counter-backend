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

const initialSits = {
	A1: false,
	A2: false,
	A3: false,
	A4: false,
	B1: false,
	B2: false,
	B3: false,
	B4: false,
	C1: false,
	C2: false,
	C3: false,
	C4: false,
	D1: false,
	D2: false,
	D3: false,
	D4: false,
	E1: false,
	E2: false,
	E3: false,
	E4: false,
	F1: false,
	F2: false,
	F3: false,
	F4: false,
};

// Post a trip with date to the database
router.post('/add/date', (req, res) => {
	collectionWithDate.findOne(
		{ trip_date: req.body.trip_date },
		(err, result) => {
			if (err) {
				res.send(err);
			} else {
				if (result) {
					collectionWithDate.findOneAndUpdate(
						{ trip_date: req.body.trip_date },
						{
							$set: {
								trips: [
									...result.trips,
									{
										trip_name: req.body.trip_name,
										trip_time: req.body.trip_time,
										sits: initialSits,
									},
								],
							},
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
					collectionWithDate.insertOne(
						{
							trip_date: req.body.trip_date,
							trips: [
								{
									trip_name: req.body.trip_name,
									trip_time: req.body.trip_time,
									sits: initialSits,
								},
							],
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
	collectionWithDate
		.find({})
		.sort({ _id: -1 })
		.toArray((err, result) => {
			if (err) {
				res.send(err);
			} else {
				res.send(result);
			}
		});
});

// get a trip with date from the database
router.post('/get/date/', (req, res) => {
	if (req.body.trip_date) {
		collectionWithDate.findOne(
			{ trip_date: req.body.trip_date },
			(err, result) => {
				if (err) {
					res.send(err);
				} else {
					if (result) {
						const trip = result.trips.filter(
							trip => trip.trip_name === req.body.trip_name
						);
						if (trip.length > 0) {
							res.send({
								_id: result._id,
								trip: trip,
							});
						} else {
							collectionWithDate.insertOne(
								{
									trip_date: req.body.trip_date,
									trips: [
										{
											trip_name: req.body.trip_name,
											trip_time: "00.00",
											sits: initialSits,
										},
									],
								},
								(err, result) => {
									if (err) {
										res.send(err);
									} else {
										res.send({
											trip: [
												{
													trip_date: req.body.trip_date,
													trips: [
														{
															trip_name: req.body.trip_name,
															trip_time: "00.00",
															sits: initialSits,
														},
													],
												}
											]
										});
									}
								}
							);
						}
					} else {
						collectionWithDate.insertOne(
							{
								trip_date: req.body.trip_date,
								trips: [
									{
										trip_name: req.body.trip_name,
										trip_time: "00.00",
										sits: initialSits,
									},
								],
							},
							(err, result) => {
								if (err) {
									res.send(err);
								} else {
									res.send({
										trip: [
											{
												trip_date: req.body.trip_date,
												trips: [
													{
														trip_name: req.body.trip_name,
														trip_time: "00.00",
														sits: initialSits,
													},
												],
											}
										]
									});
								}
							}
						);
					}
				}
			}
		);
	} else {
		res
			.status(400)
			.send({ message: 'Please provide a trip date to get the trip' });
	}
});

// delete a trip with date from the database
router.delete('/delete/date/:id', (req, res) => {
	const id = req.params.id;
	collectionWithDate.findOneAndDelete({ _id: ObjectId(id) }, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			res.send({ message: 'Trip deleted successfully' });
		}
	});
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
