import BaseBlueprint from './BaseBlueprint';
import Column from './Column';
import { RawSQL } from '../../database';

import { empty } from '../../../../helpers';

export default class CreateBlueprint extends BaseBlueprint {
  #tableName;

  #columns;

  constructor(tableName) {
    super();
    this.#tableName = tableName;
    this.#columns = [];
  }

  get sqlStmts() {
    const columns = this.#columns.map((column) => ({
      name: column.name,
      type: column.type,
      constraints: column.constraints,
    }));

    return [{
      method: 'createTable',
      args: [this.#tableName, columns],
    }];
  }

  integer(columnName) {
    const column = new Column(columnName, 'INTEGER');
    this.#columns.push(column);

    return column;
  }

  real(columnName) {
    const column = new Column(columnName, 'REAL');
    this.#columns.push(column);

    return column;
  }

  text(columnName) {
    const column = new Column(columnName, 'TEXT');
    this.#columns.push(column);

    return column;
  }

  blob(columnName) {
    const column = new Column(columnName, 'BLOB');
    this.#columns.push(column);

    return column;
  }

  timestamp(columnName) {
    const column = new Column(columnName, 'TIMESTAMP');
    this.#columns.push(column);

    return column;
  }

  id() {
    this.integer('id').primaryKey().autoIncrement().required();
  }

  timestamps(timestamps = null) {
    let columnNames = timestamps;
    if (empty(columnNames)) {
      columnNames = [
        'created_at',
        'updated_at',
        'deleted_at',
      ];
    }

    columnNames.forEach((columnName) => {
      switch (columnName) {
        case 'created_at':
        case 'updated_at':
          this.timestamp(columnNames).required().default('CURRENT_TIMESTAMP');
          break;
        case 'deleted_at':
          this.timestamp(columnNames).default(RawSQL('NULL'));
          break;
        default:
      }
    });
  }
}
