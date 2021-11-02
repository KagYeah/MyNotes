export default class Column {
  #name;

  #type;

  #constraints;

  constructor(name, type) {
    this.#name = name;
    this.#type = type;
    this.#constraints = {};
  }

  get name() {
    return this.#name;
  }

  get type() {
    return this.#type;
  }

  get constraints() {
    return this.#constraints;
  }

  required() {
    this.#constraints.required = true;

    return this;
  }

  unique() {
    this.#constraints.unique = true;

    return this;
  }

  primaryKey() {
    this.#constraints.primary_key = true;

    return this;
  }

  autoIncrement() {
    this.#constraints.auto_increment = true;

    return this;
  }

  default(value) {
    this.#constraints.default = value;

    return this;
  }

  check(expr) {
    this.#constraints.check = expr;

    return this;
  }
}
