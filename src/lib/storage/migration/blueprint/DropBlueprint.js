import BaseBlueprint from './BaseBlueprint';

export default class RenameBlueprint extends BaseBlueprint {
  #tableName;

  constructor(tableName) {
    super();
    this.#tableName = tableName;
  }

  get sqlStmts() {
    return [{
      method: 'dropTable',
      args: [this.#tableName],
    }];
  }
}
