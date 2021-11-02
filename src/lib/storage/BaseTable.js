import Database, { BaseSQL } from './database';

import { empty } from '../../helpers';

export default class BaseTable {
  #db;

  constructor(db = null) {
    this.db = db || new Database();
  }

  static get name() {
    throw new Error('File BaseTable.js: getter of name is not implemented.');
  }

  get db() {
    return this.#db;
  }

  set db(value) {
    if (value instanceof BaseSQL) {
      this.#db = value;
    } else {
      throw new RangeError('Database must be an instance of BaseSQL.');
    }
  }

  insert(values) {
    return this.db.insert(this.constructor.name, values);
  }

  async select(columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    let hasDeletedAt = false;

    try {
      hasDeletedAt = await this.hasColumn('deleted_at');
    } catch (error) {
      return Promise.reject(error);
    }

    let cond = condition;
    if (hasDeletedAt) {
      if (empty(condition)) {
        cond = {
          column: 'deleted_at',
          operator: 'IS_NULL',
        };
      } else {
        cond = {
          operator: 'AND',
          value: [
            condition,
            {
              column: 'deleted_at',
              operator: 'IS_NULL',
            },
          ],
        };
      }
    }

    return this.db.select(this.constructor.name, columns, cond, orderBy, limit, offset);
  }

  update(values, condition) {
    return this.db.update(this.constructor.name, values, condition);
  }

  delete(condition = null) {
    return this.db.delete(this.constructor.name, condition);
  }

  async softDelete(condition = null) {
    let hasDeletedAt = false;

    try {
      hasDeletedAt = await this.hasColumn('deleted_at');
    } catch (error) {
      return Promise.reject(error);
    }

    if (!hasDeletedAt) {
      return new Error("Column 'deleted_at' doesn't exist.");
    }

    return this.update({ deleted_at: this.datetime(new Date()) }, condition);
  }

  datetime(date) {
    return this.db.constructor.datetime(date);
  }

  datetime2date(datetime) {
    return this.db.constructor.datetime2date(datetime);
  }

  hasColumn(columnName) {
    return this.db.hasColumn(this.constructor.name, columnName);
  }
}
