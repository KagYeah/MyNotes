import { BaseTable } from '../../lib/storage';

import { empty } from '../../helpers';

export default class MyNotesTable extends BaseTable {
  selectById(id, columns = ['*']) {
    return this.select(columns, { column: 'id', value: id });
  }

  updateById(id, values) {
    return this.update(values, { column: 'id', value: id });
  }

  deleteById(id) {
    return this.delete({ column: 'id', value: id });
  }

  deleteByIds(ids = []) {
    if (empty(ids)) {
      return new Promise(() => {});
    }

    const condition = {
      operator: 'OR',
      value: [],
    };

    ids.forEach((id) => {
      condition.value.push({
        column: 'id',
        value: id,
      });
    });

    return this.delete(condition);
  }
}
