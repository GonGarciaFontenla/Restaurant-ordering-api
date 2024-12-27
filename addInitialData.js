const mongoose = require('mongoose');
const User = require('./models/User'); // Asegúrate de que la ruta y el nombre del archivo son correctos
const MenuItem = require('./models/MenuItem'); // Asegúrate de que la ruta y el nombre del archivo son correctos

const mongoUri = 'mongodb+srv://gongarfon23:gongarfon23@cluster0.3tjjh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    // Aquí podrías añadir datos iniciales o realizar otras operaciones
    try {
        const initialUser = new User({
            username: 'admin',
            password: 'password123',
            role: 'admin'
        });

        const initialMenuItem = new MenuItem({
            name: 'Pizza Margherita',
            price: 12.99,
            description: 'Classic pizza with tomato, mozzarella, and basil',
            available: true
        });

        await initialUser.save();
        await initialMenuItem.save();

        console.log('Initial data added');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error adding initial data', err);
    }
}).catch((error) => {
    console.error('Error connecting to MongoDB', error);
});
