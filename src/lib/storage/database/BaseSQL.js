/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
export default class BaseSQL {
  static datetime(date) {
    throw new Error('datetime() not implemented.');
  }

  static datetime2string(datetime) {
    throw new Error('datetime2string() not implemented.');
  }

  static escape(value) {
    throw new Error('escape() not implemented.');
  }

  createTable(tableName, definitions) {
    throw new Error('createTable() not implemented.');
  }

  renameTable(tableName, newName) {
    throw new Error('renameTable() not implemented.');
  }

  dropTable(tableName) {
    throw new Error('dropTable() not implemented.');
  }

  addColumn(tableName, definition) {
    throw new Error('addColumn() not implemented.');
  }

  dropColumn(tableName, column) {
    throw new Error('dropColumn() not implemented.');
  }

  insert(tableName, valueObj) {
    throw new Error('insert() not implemented.');
  }

  select(tableName, columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    throw new Error('select() not implemented.');
  }

  update(tableName, values, condition) {
    throw new Error('update() not implemented.');
  }

  delete(tableName, condition) {
    throw new Error('delete() not implemented.');
  }

  execute(sqlStmt, args = []) {
    throw new Error('execute() not implemented.');
  }

  transaction(sqlStmts) {
    throw new Error('() not implemented.');
  }
}
