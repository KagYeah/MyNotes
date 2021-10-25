import * as ExpoSQLite from 'expo-sqlite';
import { Platform } from 'react-native';

import BaseTable from '../BaseTable';
import { DATE_SEPARATOR, TIME_SEPARATOR ,empty } from '../../../helpers';
import { DB_CONFIG } from '../../../config/database';

export default class SQLite {
  #db;
  #config = {
    dbName: 'mynotes.db',
  };

  constructor() {
    this.#config = { ...this.#config, ...DB_CONFIG };

    if (Platform.OS === 'web') {
      this.#db = {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      }
    } else {
      this.#db = ExpoSQLite.openDatabase(this.#config.dbName);
    }
  }

  createMemosTable() {
    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT, body TEXT, updated_at TEXT DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')));"
          );
        },
        reject,
        resolve,
      );
    });
  }

  insert(table, valueObj) {
    this.#validateInsertArgs(table, valueObj);

    const { values, columns, placeholders } = this.#getValues(valueObj);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO ${table.name} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`,
            values,
          )
        },
        reject,
        resolve,
      );
    });
  }

  select(table, columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    this.#validateSelectArgs(table, columns, condition, orderBy, limit, offset);

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
        () => { resolve(result) },
      );
    });
  }

  datetime2string(datetime) {
    if (typeof datetime === 'string') {
      const datetimeArr = datetime.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);

      if (datetimeArr) {
        return `${datetimeArr[1]}${DATE_SEPARATOR}${datetimeArr[2]}${DATE_SEPARATOR}${datetimeArr[3]} ${datetimeArr[4]}${TIME_SEPARATOR}${datetimeArr[5]}`;
      }
    }

    return '';
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
    } else if (operator === 'NOT') {
      return ` NOT ${this.#createConditionStr(condition.value, args)} `;
    } else if (['IS_NULL', 'IS_NOT_NULL'].includes(operator)) {
      return ` ${condition.column} ${operator} `;
    }

    args.push(condition.value);

    return ` ${condition.column} ${operator} ? `;
  }

  #createLimitPhrase = (limit, offset) => {
    const limitPhrase = '';
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

  #createWherePhrase = (condition) => {
    const whereArgs = [];
    const wherePhrase = empty(condition) ? '' : ` WHERE ${this.#createConditionStr(condition, whereArgs)} `;

    return { wherePhrase, whereArgs };
  };

  #getType = (value) => {
    if (value === null) {
      return 'NULL';
    } else if (typeof value === 'number') {
      if (String(value).match(/^\d+$/g)) {
        return 'INTEGER';
      } else {
        return 'REAL';
      }
    } else if (typeof value === 'string') {
      return 'TEXT';
    }

    return 'BLOB';
  };

  #getValues = (valueObj) => {
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
    } else if (['!=', '!=='].includes(op)) {
      return '<>';
    }

    return op;
  };

  #validateColumn = (table, column) => {
    if (!table.hasColumn(column)) {
      throw new RangeError(`Range Error: Column '${column}' is not defined in table '${table.name}'.`);
    }
  };

  #validateType = (value, type, nullable = false) => {
    if (value === null) {
      if (nullable) {
        return;
      } else {
        throw new TypeError('Type Error: forbit null.');
      }
    }

    if (!nullable && value === null)
    if (typeof type === 'string') {
      if (
        (type === 'array' && !Array.isArray(value))
        || typeof value !== type
      ) {
        throw new TypeError(`Type Error: expected '${type}', but given '${typeof value}'.`);
      }
    } else {
      if (!(value instanceof type)) {
        throw new TypeError(`Type Error: expected an instance of ${type.toString()}, but actually not.`);
      }
    }
  };

  #validateInsertArgs = (table, columnValues) => {
    this.#validateType(table, BaseTable);
    this.#validateType(columnValues, 'object');

    Object.keys(columnValues).forEach((column) => {
      this.#validateType(column, 'string');
      this.#validateColumn(table, column);

      if (this.#getType(columnValues[column]).toUpperCase() !== table.columnTypes[column].toUpperCase()) {
        throw new TypeError(`Type Error: insert(): The type of '${column}' must be '${table.columnTypes[column]}'.`);
      }
    });
  }

  #validateSelectArgs = (table, columns, condition, orderBy, limit, offset) => {
    this.#validateType(table, BaseTable);
    this.#validateType(columns, 'array');
    this.#validateType(condition, 'object', true);
    this.#validateType(orderBy, 'array', true);
    this.#validateType(limit, 'number', true);
    this.#validateType(offset, 'number', true);

    columns.forEach((column) => {
      if (column !== '*') {
        this.#validateType(column, 'string');
        this.#validateColumn(table, column);
      }
    });

    if (!empty(condition)) {
      this.#validateConditionObj(condition);
    }

    if (!empty(orderBy)) {
      orderBy.forEach((orderByObj) => {
        this.#validateType(orderByObj, 'object');
        this.#validateType(orderByObj.column, 'string');
        this.#validateColumn(table, orderByObj.column);
        if (!empty(orderByObj.order)) {
          this.#validateType(orderByObj.order, 'string');
          if (!(['ASC', 'DESC'].includes(orderByObj.order.toUpperCase()))) {
            throw new RangeError("Range Error: 'order' must be 'ASC' or 'DESC'.");
          }
        }
      });
    }

    if (!empty(limit) && !limit.toString().match(/^\d+$/g)) {
      throw new RangeError("Range Error: Argument 'limit' must be integer and >= 0.");
    }

    if (!empty(offset) && !offset.toString().match(/^\d+$/g)) {
      throw new RangeError("Range Error: Argument 'offset' must be integer and >= 0.");
    }
  };

  #validateConditionObj = (condition) => {
    this.#validateType(condition, 'object');

    const operator = this.#normalizeOperator(condition.operator);

    if (['AND', 'OR'].includes(operator)) {
      this.#validateType(condition.value, 'array');
      condition.value.forEach((innerCondition) => {
        this.#validateConditionObj(innerCondition);
      });
    } else if (operator === 'NOT') {
      this.#validateConditionObj(condition.value);
    } else {
      this.#validateType(condition.column, 'string');
      this.#validateColumn(table, condition.column);
      if (
        typeof condition.value !== 'number'
        && typeof condition.value !== 'string'
      ) {
        throw TypeError("Type Error: If operator is not 'AND' or 'OR', type of value must be string or number.");
      }
    }
  };
}
