export default class RawSQL {
  #rawSQL;

  constructor(rawSQL) {
    this.rawSQL = rawSQL;
  }

  get rawSQL() {
    return this.#rawSQL;
  }

  set rawSQL(value) {
    if (typeof value === 'string') {
      this.#rawSQL = value;
    } else {
      this.#rawSQL = '';
    }
  }
}
