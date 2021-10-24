import BaseTable from "../../lib/storage/BaseTable";

export default class MemosTable extends BaseTable {
  get name() {
    return 'memos';
  }

  get columnTypes() {
    return {
      id: 'INTEGER',
      title: 'TEXT',
      body: 'TEXT',
      updated_at: 'TEXT',
    };
  }
}
