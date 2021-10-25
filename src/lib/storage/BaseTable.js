import AbstractTable from './AbstractTable';
import SQLite from './database/SQLite';

export default class BaseTable extends AbstractTable {
  #db;

  #columnTypes = {
    id: 'INTEGER',
  };

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

  static datetime(date) {
    return SQLite.datetime(date);
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

  selectById(id, columns = ['*']) {
    return this.#db.select(this, columns, { column: 'id', value: id });
  }

  updateById(id, values) {
    return this.#db.update(this, values, { column: 'id', value: id });
  }

  delete(condition = null) {
    return this.#db.delete(this.#db, condition);
  }

  deleteById(id) {
    return this.#db.delete(this, { column: 'id', value: id });
  }

  deleteByIds(ids = []) {
    const condition = {
      operator: 'OR',
      value: [],
    };

    ids.forEach((id) => {
      condition.value.push({
        column: 'id',
        value: id,
      });
    });

    return this.#db.delete(this.delete, condition);
  }
}
