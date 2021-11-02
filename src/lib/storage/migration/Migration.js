/* eslint-disable class-methods-use-this */
import CreateBlueprint from './blueprint/CreateBlueprint';
import RenameBlueprint from './blueprint/RenameBlueprint';
import AlterBlueprint from './blueprint/AlterBlueprint';
import DropBlueprint from './blueprint/DropBlueprint';

export default class Migration {
  #blueprints;

  constructor() {
    this.#blueprints = [];
  }

  get blueprints() {
    return this.#blueprints;
  }

  migrate() {
    throw new Error('migrate() not implemented.');
  }

  create(tableName, callable) {
    const blueprint = new CreateBlueprint(tableName);
    callable(blueprint);
    this.#blueprints.push(blueprint);
  }

  rename(oldName, newName) {
    const blueprint = new RenameBlueprint(oldName, newName);
    this.#blueprints.push(blueprint);
  }

  alter(tableName, callable) {
    const blueprint = new AlterBlueprint(tableName);
    callable(blueprint);
    this.#blueprints.push(blueprint);
  }

  drop(tableName) {
    const blueprint = new DropBlueprint(tableName);
    this.#blueprints.push(blueprint);
  }
}
