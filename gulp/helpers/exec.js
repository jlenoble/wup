import {exec} from 'child_process';

const echo = cb => (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (cb) {
    cb(err);
  }
}

export default function (cmd, cb) {
  return exec(cmd, echo(cb));
}
