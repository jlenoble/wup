export default class Base {
  constructor (options = {}) {
    if (typeof options === 'string') {
      options = {title: options};
    }

    this.init(options);
  }

  init (options = {}) {
    const {title} = options;
    const {dict, models, name, Model} = this.constructor;

    if (dict.has(title)) { // By default reject redundancy
      console.warn(`"${title}" is already a ${name}`);
      return;
    }

    const model = new Model(options);
    model.save(err => {
      if (err) {
        return console.error(err);
      }

      models.set(model._id, model);
      dict.set(model.title, model);
    });

    Object.defineProperty(this, 'model', {value: model});
  }

  static init (Model) {
    if (this.Model) { // Run only once
      return;
    }

    const mods = new Map();
    const dict = new Map();

    Model.find({}, (err, models) => {
      if (err) {
        console.error(err);
        return;
      }

      models.forEach(model => {
        const {title, _id} = model;

        mods.set(_id, model);
        dict.set(title, model);
      });

      if (mods.size !== dict.size) {
        console.warn(`${mods.size - dict.size} redundant ${Model.name}(s)`);
      }
    });

    Object.defineProperties(this, {
      Model: {value: Model},
      models: {value: mods},
      dict: {value: dict},
    });
  }

  static list () {
    return Array.from(this.dict.keys());
  }
}
