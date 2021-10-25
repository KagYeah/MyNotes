import AbstractTable from './AbstractTable';
import SQLite from './database/SQLite';

export default class BaseTable extends AbstractTable {
  #db;

  #columnTypes = {};

  #name = '';

  constructor() {
    super();
    this.#db = new SQLite();
  }

  get columnTypes() {
    return this.#columnTypes;
  }

  get name() {
    return this.#name;
  }

  static datetime2string(datetime) {
    return SQLite.datetime2string(datetime);
  }

  createMemosTable() {
    return this.#db.createMemosTable();
  }

  insert(values) {
    return this.#db.insert(this, values);
  }

  select(columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    return this.#db.select(this, columns, condition, orderBy, limit, offset);
  }
}
