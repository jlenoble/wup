import Base from './base';
import {Problem as Model} from '../mongoose/models';

export default class Problem extends Base {}

Problem.init(Model);
