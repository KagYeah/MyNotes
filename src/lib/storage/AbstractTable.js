export default class AbstractTable {
  #columnTypes = {};

  #name = '';

  get columnTypes() {
    return this.#columnTypes;
  }

  get name() {
    return this.#name;
  }

  hasColumn(column) {
    if (Object.keys(this.columnTypes).includes(column)) {
      return true;
    }

    return false;
  }
}
