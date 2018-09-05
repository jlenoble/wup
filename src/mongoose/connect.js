import mongoose from 'mongoose';

const host = 'localhost';
const db = 'wup';

const mongoUri = `mongodb://${host}/${db}`;

mongoose.connect(mongoUri, {useNewUrlParser: true});
