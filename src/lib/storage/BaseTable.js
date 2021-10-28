/* eslint-disable class-methods-use-this */
import Database from './database';

export default class BaseTable {
  #db;

  constructor() {
    this.#db = new Database();
  }

  static datetime(date) {
    return Database.datetime(date);
  }

  static datetime2string(datetime) {
    return Database.datetime2string(datetime);
  }

  get name() {
    throw new Error('File BaseTable.js: getter of name is not implemented.');
  }

  insert(values) {
    return this.#db.insert(this, values);
  }

  select(columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    return this.#db.select(this, columns, condition, orderBy, limit, offset);
  }

  update(values, condition) {
    return this.#db.update(this, values, condition);
  }

  delete(condition = null) {
    return this.#db.delete(this, condition);
  }
}
