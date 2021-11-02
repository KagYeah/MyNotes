import BaseBlueprint from './BaseBlueprint';
import Column from './Column';

export default class AlterBlueprint extends BaseBlueprint {
  #tableName;

  #sqlStmts;

  constructor(tableName) {
    super();
    this.#tableName = tableName;
    this.#sqlStmts = [];
  }

  get sqlStmts() {
    return this.#sqlStmts.map((sqlStmt) => {
      const [method, column] = sqlStmt;

      switch (method) {
        case 'addColumn':
          return {
            method,
            args: [
              this.#tableName,
              {
                name: column.name,
                type: column.type,
                constraints: column.constraints,
              },
            ],
          };
        case 'dropColumn':
          return {
            method,
            args: [this.#tableName, column.name],
          };
        default:
      }

      return { method: '', args: [] };
    });
  }

  integer(columnName) {
    const column = new Column(columnName, 'INTEGER');
    this.#sqlStmts.push(['addColumn', column]);

    return column;
  }

  real(columnName) {
    const column = new Column(columnName, 'REAL');
    this.#sqlStmts.push(['addColumn', column]);

    return column;
  }

  text(columnName) {
    const column = new Column(columnName, 'TEXT');
    this.#sqlStmts.push(['addColumn', column]);

    return column;
  }

  blob(columnName) {
    const column = new Column(columnName, 'BLOB');
    this.#sqlStmts.push(['addColumn', column]);

    return column;
  }

  drop(columnName) {
    const column = new Column(columnName, '');
    this.#sqlStmts.push(['dropColumn', column]);
  }
}
