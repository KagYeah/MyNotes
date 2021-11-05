import { Migration } from '../../lib/storage/migration';

export default class AddNotificationIdToSchedulesTable extends Migration {
  migrate() {
    this.alter('schedules', (blueprint) => {
      blueprint.text('notification_id');
    });
  }
}
