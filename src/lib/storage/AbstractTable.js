/* eslint-disable class-methods-use-this */
export default class AbstractTable {
  get columnTypes() {
    throw new Error('File AbstractTable.js: getter of columnTypes is not implemented.');
  }

  get name() {
    throw new Error('File AbstractTable.js: getter of name is not implemented.');
  }

  hasColumn(column) {
    if (Object.keys(this.columnTypes).includes(column)) {
      return true;
    }

    return false;
  }
}
