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

    const asyncThisClass = new Promise(resolve => {
      Model.find({}, (err, models) => {
        if (err) {
          console.error(err);
        } else {
          models.forEach(model => {
            const {title, _id} = model;

            mods.set(_id, model);
            dict.set(title, model);
          });

          if (mods.size !== dict.size) {
            console.warn(`${mods.size - dict.size} redundant ${Model.name}(s)`);
          }
        }

        resolve(this);
      });
    });

    Object.defineProperties(this, {
      Model: {value: Model},
      models: {value: mods},
      dict: {value: dict},
      async: {
        async get () {
          return asyncThisClass;
        },
      },
    });
  }

  static _toMime () {
    const data = {
      name: this.name,
      display: this.display,
      props: {
        models: Array.from(this.models),
        keys: this.keys || [],
      },
    }

    return {
      'react/component': JSON.stringify(data),
    };
  }

  static async list () {
    $$.async();
    const that = await this.async;
    that.display = 'base';
    $$.sendResult(that);
  }
}

['ul', 'ol', 'table'].forEach(display => {
  const fn = async function (keys = ['title']) {
    $$.async();
    const that = await this.async;
    that.display = display;
    that.keys = Array.isArray(keys) ? keys : [keys];
    $$.sendResult(that);
  }

  Object.defineProperty(fn, 'name', {value: display});

  Base[display] = fn;
});
