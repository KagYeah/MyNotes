import { Migration } from '../../lib/storage/migration';

export default class CreateMemosTable extends Migration {
  migrate() {
    this.create('memos', (blueprint) => {
      blueprint.id();
      blueprint.text('title');
      blueprint.text('body');
      blueprint.timestamps(['updated_at']);
    });
  }
}
