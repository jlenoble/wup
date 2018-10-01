import moment from 'moment';
import path from 'path';
import {logDir} from './dirs';

export const now = moment();

export const thisMonth = now.format('YYYY/MM');
export const thisMonthDir = path.join(logDir, thisMonth);

export const today = now.format('YYYY/MM/DD');
export const todayNotebook = path.join(logDir, today + '.ipynb');
