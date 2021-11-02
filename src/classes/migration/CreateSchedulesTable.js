import { Migration } from '../../lib/storage/migration';

export default class CreateSchedulesTable extends Migration {
  migrate() {
    this.create('schedules', (blueprint) => {
      blueprint.id();
      blueprint.text('title');
      blueprint.text('start_time').required();
      blueprint.text('end_time').required();
    });
  }
}
