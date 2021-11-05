import { Migration } from '../../lib/storage/migration';

export default class AddNotificationIdToTasksTable extends Migration {
  migrate() {
    this.alter('tasks', (blueprint) => {
      blueprint.text('notification_id');
    });
  }
}
