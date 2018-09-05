import mongoose from '../connect';

const schema = new mongoose.Schema({
  title: String,
});

export default mongoose.model('Problem', schema);
