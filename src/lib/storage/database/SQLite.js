import * as ExpoSQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { format } from 'date-fns';

import { DATE_SEPARATOR, TIME_SEPARATOR, empty } from '../../../helpers';
import { DB_CONFIG } from '../../../config/database';

export default class SQLite {
  #db;

  #config = {
    dbName: 'mynotes.db',
  };

  constructor(config = null) {
    this.#config = { ...this.#config, ...DB_CONFIG, ...config };

    if (Platform.OS === 'web') {
      this.#db = {
        transaction: () => ({
          executeSql: () => {},
        }),
      };
    } else {
      this.#db = ExpoSQLite.openDatabase(this.#config.dbName);
    }
  }

  static datetime(date) {
    if (!(date instanceof Date)) {
      return '';
    }

    return format(date, 'yyyy-MM-dd HH:mm:ss');
  }

  static datetime2string(datetime) {
    if (typeof datetime === 'string') {
      const datetimeArr = datetime.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);

      if (datetimeArr) {
        return `${datetimeArr[1]}${DATE_SEPARATOR}${datetimeArr[2]}${DATE_SEPARATOR}${datetimeArr[3]} ${datetimeArr[4]}${TIME_SEPARATOR}${datetimeArr[5]}`;
      }
    }

    return '';
  }

  insert(table, valueObj) {
    const { values, columns, placeholders } = this.#getInsertValues(valueObj);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO ${table.name} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`,
            values,
          );
        },
        reject,
        resolve,
      );
    });
  }

  select(table, columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    const { wherePhrase, whereArgs } = this.#createWherePhrase(condition);
    const orderByPhrase = this.#createOrderByPhrase(orderBy);
    const { limitPhrase, limitArgs } = this.#createLimitPhrase(limit, offset);

    const sqlStmt = `SELECT ${columns.join(', ')} FROM ${table.name} ${wherePhrase} ${orderByPhrase} ${limitPhrase};`;
    const args = whereArgs.concat(limitArgs);

    let result = [];

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt, args, (_, { rows }) => {
            result = rows;
          });
        },
        reject,
        () => { resolve(result); },
      );
    });
  }

  update(table, values, condition) {
    const { setPhrase, setArgs } = this.#createSetPhrase(values);
    const { wherePhrase, whereArgs } = this.#createWherePhrase(condition);

    const sqlStmt = `UPDATE ${table.name} ${setPhrase} ${wherePhrase};`;
    const args = setArgs.concat(whereArgs);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt, args);
        },
        reject,
        resolve,
      );
    });
  }

  delete(table, condition) {
    const { wherePhrase, whereArgs } = this.#createWherePhrase(condition);

    const sqlStmt = `DELETE FROM ${table.name} ${wherePhrase};`;
    const args = whereArgs;

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt, args);
        },
        reject,
        resolve,
      );
    });
  }

  // private methods
  #createConditionStr = (condition, args) => {
    if (empty(condition)) {
      return '';
    }

    const operator = this.#normalizeOperator(condition.operator);
    if (['AND', 'OR'].includes(operator)) {
      const innerConditions = condition.value.map((c) => this.#createConditionStr(c, args));
      return innerConditions.join(` ${operator} `);
    }

    if (operator === 'NOT') {
      return ` NOT ${this.#createConditionStr(condition.value, args)} `;
    }

    if (['IS_NULL', 'IS_NOT_NULL'].includes(operator)) {
      return ` ${condition.column} ${operator} `;
    }

    args.push(condition.value);

    return ` ${condition.column} ${operator} ? `;
  }

  #createLimitPhrase = (limit, offset) => {
    let limitPhrase = '';
    const limitArgs = [];

    if (!empty(limit)) {
      limitPhrase += ' LIMIT ? ';
      limitArgs.push(limit);

      if (!empty(offset)) {
        limitPhrase += ' OFFSET ? ';
        limitArgs.push(offset);
      }
    }

    return { limitPhrase, limitArgs };
  };

  #createOrderByPhrase = (orderBy) => {
    if (empty(orderBy)) {
      return '';
    }

    const orderByArr = orderBy.map((orderByObj) => {
      if (empty(orderByObj.order)) {
        return ` ${orderByObj.column} `;
      }

      return ` ${orderByObj.column} ${orderByObj.order} `;
    });

    return ` ORDER BY ${orderByArr.join(', ')} `;
  };

  #createSetPhrase = (values) => {
    const setPhraseArr = [];
    const setArgs = [];

    Object.keys(values).forEach((column) => {
      setPhraseArr.push(` ${column} = ? `);
      setArgs.push(values[column]);
    });

    return {
      setPhrase: ` SET ${setPhraseArr.join(',')} `,
      setArgs,
    };
  };

  #createWherePhrase = (condition) => {
    const whereArgs = [];
    const conditionStr = this.#createConditionStr(condition, whereArgs).trim();
    const wherePhrase = empty(conditionStr) ? '' : ` WHERE ${conditionStr} `;

    return { wherePhrase, whereArgs };
  };

  #getType = (value) => {
    if (value === null) {
      return 'NULL';
    }

    if (typeof value === 'number') {
      if (String(value).match(/^\d+$/g)) {
        return 'INTEGER';
      }
      return 'REAL';
    }

    if (typeof value === 'string') {
      return 'TEXT';
    }

    return 'BLOB';
  };

  #getInsertValues = (valueObj) => {
    const columns = [];
    const values = [];

    Object.keys(valueObj).forEach((key) => {
      columns.push(key);
      values.push(valueObj[key]);
    });

    const placeholders = Array(values.length).fill('?');

    return { columns, values, placeholders };
  }

  #normalizeOperator = (operator) => {
    let op = '=';
    if (typeof operator === 'string') {
      op = operator.trim().toUpperCase();
    }

    if (['==', '==='].includes(op)) {
      return '=';
    }

    if (['!=', '!=='].includes(op)) {
      return '<>';
    }

    return op;
  };
}
