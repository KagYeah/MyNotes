import { Migration } from '../../lib/storage/migration';

export default class CreateTasksTable extends Migration {
  migrate() {
    this.create('tasks', (blueprint) => {
      blueprint.id();
      blueprint.text('title');
      blueprint.text('deadline').required();
    });
  }
}
