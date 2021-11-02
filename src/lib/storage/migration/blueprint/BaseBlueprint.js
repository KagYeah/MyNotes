/* eslint-disable class-methods-use-this */
export default class BaseBlueprint {
  get sqlStmts() {
    throw new Error('Getter of sqlStmts not implemented.');
  }
}
