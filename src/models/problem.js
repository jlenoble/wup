import {Problem as Model} from '../mongoose/models';

const problems = new Map();
const dict = new Map();

Model.find({}, (err, models) => {
  if (err) {
    throw err;
  }

  models.forEach(model => {
    const {title, _id} = model;

    problems.set(_id, model);
    dict.set(title, model);
  });

  if (problems.size !== dict.size) {
    console.error(`${problems.size - dict.size} redundant problems`);
  }
});

export default class Problem {
  constructor (options = {}) {
    if (typeof options === 'string') {
      options = {title: options};
    }

    const {title} = options;

    if (dict.has(title)) {
      console.error(`"${title}" is already a problem`);
      return;
    }

    const model = new Model(options);
    model.save(err => {
      if (err) {
        return console.error(err);
      }

      problems.set(model._id, model);
      dict.set(model.title, model);
    });

    Object.defineProperty(this, 'model', {value: model});
  }

  static list () {
    return Array.from(dict.keys());
  }
}
