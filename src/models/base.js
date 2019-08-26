import makeProxy from 'proxy-helpers';

class MongooseModelWrapper { // Not exported, use Controller below
  constructor (model) {
    const {Model} = this.constructor;
    Object.defineProperty(this, 'model', {value: new Model(model)});
  }

  save () {
    const {models, dict} = this.constructor;
    const model = this.model;

    const promise = model.save(err => {
      if (err) {
        return console.error(err);
      }

      models.set(model._id.toString(), this);
      dict.set(model.title, this);
    });

    this.table({promise});

    return this;
  }

  update (options = {}) {
    if (typeof options === 'string') {
      options = {title: options}; // eslint-disable-line no-param-reassign
    }

    const model = this.model;

    // eslint-disable-next-line new-cap
    const promise = model.updateOne(options, (err, a, b) => {
      if (err) {
        return console.error(err);
      }

      console.log(model, a, b);
    });

    this.table({promise});

    return this;
  }

  delete () {
    const {dict, models, Model} = this.constructor;
    const model = this.model;

    // eslint-disable-next-line new-cap
    const promise = Model.deleteOne(model, err => {
      if (err) {
        return console.error(err);
      }

      models.delete(model._id.toString());
      dict.delete(model.title);

      const proxy = makeProxy(this);

      proxy.forEachMethodAll((_fn, name) => {
        if (name === '_toMime') {
          this._toMime = () => {
            return {
              'text/html': `<pre>Object ${model} has been destroyed</pre>`,
            };
          };
        } else if (name === 'valueOf' || name === 'toString') {
          this[name] = () => '';
        } else {
          this[name] = () => {
            console.warn(`Object ${model} has been destroyed, calling .${
              name}(...) on it has no effect.`);
          };
        }

        Object.defineProperty(this[name], 'name', {
          value: 'overridden_' + name,
        });
      });
    });

    this.table({promise});

    return this;
  }

  _toMime () {
    const data = {
      name: this.constructor.Model.name,
      display: this.display || 'base',
      props: {
        models: [[this.model._id.toString(), this.model._doc]],
        keys: this.keys || [],
      },
    };

    return {
      'react/component': JSON.stringify(data),
    };
  }

  async table ({
    promise = Promise.resolve(),
    keys = ['_id', 'title'],
    display = 'table',
  } = {}) {
    $$.async();
    await promise;
    Object.defineProperty(this, 'display', {value: display, writable: true});
    Object.defineProperty(this, 'keys', {value: keys, writable: true});
    $$.sendResult(this);
  }
}

export default class Controller {
  constructor (options = {}) {
    // May return an existing MongooseModelWrapper or derived class instance or
    // create a new one
    // May be overridden by inheritance
    // The whole point of this hack is to be able to call 'new' seamlessly as in
    //   new DerivedController('stuff')
    // which should return an instance of MongooseModelWrapper or
    // of a derived class
    return this.constructor.create(options);
  }

  static init (MongooseModel) {
    if (this.Wrapper) { // Run only once
      return;
    }

    class Wrapper extends MongooseModelWrapper {};

    const mods = new Map();
    const dict = new Map();

    const asyncThisClass = new Promise(resolve => {
      MongooseModel.find({}, (err, models) => {
        if (err) {
          console.error(err);
        } else {
          models.forEach(model => {
            const {title, _id} = model;
            const wrapper = new Wrapper(model);

            mods.set(_id.toString(), wrapper);
            dict.set(title, wrapper);
          });

          if (mods.size !== dict.size) {
            console.warn(`${mods.size - dict.size} redundant ${
              MongooseModel.name}(s)`);
          }
        }

        resolve(this);
      });
    });

    Object.defineProperties(Wrapper, {
      Model: {value: MongooseModel},
      Controller: {value: this},
      models: {value: mods},
      dict: {value: dict},
      async: {
        async get () {
          return asyncThisClass.then(() => Wrapper);
        },
      },
    });

    Object.defineProperties(this, {
      Model: {value: MongooseModel},
      Wrapper: {value: Wrapper},
      models: {value: mods},
      dict: {value: dict},
      async: {
        async get () {
          return asyncThisClass;
        },
      },
    });
  }

  static create (options = {}) {
    if (typeof options === 'string') {
      options = {title: options}; // eslint-disable-line no-param-reassign
    }

    const {title} = options;

    // Use inheritance
    const {dict, Wrapper, Model: {name}} = this;

    if (dict.has(title)) { // By default reject redundancy
      console.warn(`"${title}" is already a ${name}`);
      return dict.get(title);
    }

    const wrapper = new Wrapper(options);
    return wrapper.save();
  }

  static read (options = {}, hint = 'read') {
    const {dict, models} = this;

    let _id;

    if (typeof options === 'string') {
      _id = options;
    } else {
      _id = (options._id || '').toString() || options.title;
    }

    let wrapper;

    if (models.has(_id)) {
      wrapper = models.get(_id);
    } else if (dict.has(_id)) {
      wrapper = dict.get(_id);
    } else {
      console.warn(`Not ${hint}: ${_id} refers to nothing`);
    }

    return wrapper;
  }

  static update (options1 = {}, options2 = {}) {
    const wrapper = this.read(options1, 'updated');

    if (!wrapper) {
      return null;
    }

    return wrapper.update(options2);
  }

  static delete (options = {}) {
    const wrapper = this.read(options, 'deleted');

    if (!wrapper) {
      return null;
    }

    return wrapper.delete();
  }

  static _toMime () {
    const data = {
      name: this.name,
      display: this.display || 'base',
      props: {
        models: Array.from(this.models).map(([k, w]) => [k, w.model._doc]),
        keys: this.keys || [],
      },
    };

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
    const that = await this.async; // eslint-disable-line no-invalid-this
    that.display = display;
    that.keys = Array.isArray(keys) ? keys : [keys];
    $$.sendResult(that);
  };

  Object.defineProperty(fn, 'name', {value: display});

  Controller[display] = fn;
});
