import moment from 'moment';
import path from 'path';
import {logDir} from './dirs';

export const thisMonth = () => moment().format('YYYY/MM');
export const thisMonthDir = () => path.join(logDir, thisMonth());

export const today = () => moment().format('YYYY/MM/DD');
export const todayNotebook = () => path.join(logDir, today() + '.ipynb');
