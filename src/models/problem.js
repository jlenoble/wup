import Model from '../mongoose/schemas/problem';

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
    throw new Error(`${problems.size - dict.size} redundant problems`);
  }
});

export default class Problem {
  constructor (options = {}) {
    if (typeof options === 'string') {
      options = {title: options};
    }

    const {title} = options;

    if (dict.has(title)) {
      throw new Error(`"${title}" is already a problem`);
    }

    const model = new Model(options);
    model.save(err => {
      if (err) {
        throw err;
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
