import mongoose from 'mongoose';
import * as schemas from './schemas';

export const Problem = mongoose.model('Problem', schemas.problem);
