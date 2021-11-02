import BaseTable from './BaseTable';

export default class MigrationsTable extends BaseTable {
  static get name() {
    return 'migrations';
  }
}
