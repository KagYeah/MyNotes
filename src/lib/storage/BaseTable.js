import SQLite from './database/SQLite';

export default class BaseTable {
  #db;

  constructor() {
    this.#db = new SQLite();
  }

  get columnTypes() {
    return {};
  }

  get name() {
    return '';
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

  hasColumn(column) {
    if (Object.keys(this.columnTypes).includes(column)) {
      return true;
    }

    return false;
  };
}
