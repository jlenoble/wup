import moment from 'moment';
import path from 'path';
import {logDir} from './dirs';

export const safeNow = () => {
  // Make sure consecutive calls don't cross midnight
  let now;

  if (
    moment().add(1, 'days').startOf('day').isAfter(moment().add(1, 'minutes'))
  ) {
    now = moment();
  } else {
    now = moment().add(1, 'minutes');
  }

  return now;
};

export const safeBefore = n => {
  // Make sure consecutive calls don't cross midnight
  let before;

  if (
    moment().add(1, 'days').startOf('day').isAfter(moment().add(1, 'minutes'))
  ) {
    before = moment().subtract(n, 'days');
  } else {
    before = moment().add(1, 'minutes').subtract(n, 'days');
  }

  return before;
};

export const thisMidnight = () => safeNow().add(1, 'days').startOf('day');

export const thisMonth = () => safeNow().format('YYYY/MM');
export const thisMonthDir = () => path.join(logDir, thisMonth());

export const today = () => safeNow().format('YYYY/MM/DD');
export const todayNotebook = () => path.join(logDir, today() + '.ipynb');

export const someDaysBefore = n => safeBefore(n).format('YYYY/MM/DD');
export const someDaysBeforeNotebook = n => path.join(logDir, someDaysBefore(n)
  + '.ipynb');
