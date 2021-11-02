import BaseBlueprint from './BaseBlueprint';

export default class RenameBlueprint extends BaseBlueprint {
  #oldTableName;

  #newTableName;

  constructor(oldTableName, newTableName) {
    super();
    this.#oldTableName = oldTableName;
    this.#newTableName = newTableName;
  }

  get sqlStmts() {
    return [{
      method: 'renameTable',
      args: [this.#oldTableName, this.#newTableName],
    }];
  }
}
