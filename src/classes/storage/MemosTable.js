import BaseTable from '../../lib/storage/BaseTable';

export default class MemosTable extends BaseTable {
  #columnTypes = {
    id: 'INTEGER',
    title: 'TEXT',
    body: 'TEXT',
    updated_at: 'TEXT',
  };

  #name = 'memos';

  get columnTypes() {
    return this.#columnTypes;
  }

  get name() {
    return this.#name;
  }
}
