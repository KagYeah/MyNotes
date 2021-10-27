/* eslint-disable class-methods-use-this */
import AbstractTable from './AbstractTable';
import SQLite from './database/SQLite';

export default class BaseTable extends AbstractTable {
  #db;

  constructor() {
    super();
    this.#db = new SQLite();
  }

  static datetime(date) {
    return SQLite.datetime(date);
  }

  static datetime2string(datetime) {
    return SQLite.datetime2string(datetime);
  }

  get name() {
    throw new Error('File AbstractTable.js: getter of name is not implemented.');
  }

  get columnTypes() {
    throw new Error('File AbstractTable.js: getter of columnTypes is not implemented.');
  }

  hasColumn(column) {
    if (Object.keys(this.columnTypes).includes(column)) {
      return true;
    }

    return false;
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
