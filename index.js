// Import required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const client = require('./config/mongoDb');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

// Import Routes
const adminRoutes = require('./routes/adminRoute');
const tripRoutes = require('./routes/tripRoutes');

// application routes
const run = async () => {
	try {
		await client.connect();
		console.log('Connected to MongoDB');

		app.get('/', (req, res) => {
			res.send('Hey, Welcome To API 🎉');
		});
		app.use('/users', adminRoutes);
		app.use('/trips', tripRoutes);
	} catch (err) {
		console.log(err);
	}
};

run().catch(console.dir);

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server started on http://localhost:${port}/`));
