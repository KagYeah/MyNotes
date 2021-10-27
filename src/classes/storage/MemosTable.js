import MyNotesTable from './MyNotesTable';

export default class MemosTable extends MyNotesTable {
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
