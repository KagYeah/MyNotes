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
