import * as ExpoSQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { format } from 'date-fns';

import { DATE_SEPARATOR, TIME_SEPARATOR, empty } from '../../../helpers';
import { DB_CONFIG } from '../../../config/database';

import BaseSQL from './BaseSQL';
import RawSQL from './type/RawSQL';

export default class SQLite extends BaseSQL {
  #db;

  #config = {
    dbName: 'mynotes.db',
  };

  constructor(config = null) {
    super();

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

  static escape(value) {
    if (typeof value === 'string') {
      return `'${value}'`;
    }

    return value;
  }

  createTable(tableName, columns) {
    const { sqlStmt } = this.#getSqlStmt('createTable', tableName, columns);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt);
        },
        reject,
        resolve,
      );
    });
  }

  renameTable(oldName, newName) {
    const { sqlStmt } = this.#getSqlStmt('reanameTable', oldName, newName);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt);
        },
        reject,
        resolve,
      );
    });
  }

  dropTable(tableName) {
    const { sqlStmt } = this.#getSqlStmt('dropTable', tableName);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt);
        },
        reject,
        resolve,
      );
    });
  }

  addColumn(tableName, column) {
    const { sqlStmt } = this.#getSqlStmt('addColumn', tableName, column);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt);
        },
        reject,
        resolve,
      );
    });
  }

  dropColumn(tableName, column) {
    const { sqlStmt } = this.#getSqlStmt('dropColumn', tableName, column);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt);
        },
        reject,
        resolve,
      );
    });
  }

  insert(tableName, valueObj) {
    const { sqlStmt, args } = this.#getSqlStmt('insert', tableName, valueObj);

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

  select(tableName, columns = ['*'], condition = null, orderBy = null, limit = null, offset = null) {
    const { sqlStmt, args } = this.#getSqlStmt('select', tableName, columns, condition, orderBy, limit, offset);

    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt, args, (_, { rows }) => {
            resolve(rows);
          });
        },
        reject,
      );
    });
  }

  update(tableName, values, condition) {
    const { sqlStmt, args } = this.#getSqlStmt('update', tableName, values, condition);

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

  delete(tableName, condition) {
    const { sqlStmt, args } = this.#getSqlStmt('delete', tableName, condition);

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

  hasColumn(tableName, columnName) {
    return new Promise((resolve, reject) => {
      this.execute(`PRAGMA table_info(${tableName})`)
        .then((result) => {
          resolve(result._array.some((column) => column.name === columnName));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  execute(sqlStmt, args = []) {
    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          tx.executeSql(sqlStmt, args, (_, { rows }) => {
            resolve(rows);
          });
        },
        reject,
      );
    });
  }

  transaction(sqlStmts) {
    return new Promise((resolve, reject) => {
      this.#db.transaction(
        (tx) => {
          sqlStmts.forEach((sqlStmtObj) => {
            const { sqlStmt, args } = this.#getSqlStmt(sqlStmtObj.method, ...sqlStmtObj.args);
            tx.executeSql(sqlStmt, args);
          });
        },
        reject,
        resolve,
      );
    });
  }

  // private methods
  #createConditionStr = (condition, args = null) => {
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

    if (['IS NULL', 'IS NOT NULL'].includes(operator)) {
      return ` ${condition.column} ${operator} `;
    }

    if (Array.isArray(args)) {
      args.push(condition.value);

      return ` ${condition.column} ${operator} ? `;
    }

    return ` ${condition.column} ${operator} ${this.escape(condition.value)} `;
  }

  #createColumnDefinitionArr = (columns) => {
    const definitionArr = columns.map((column) => {
      if (empty(column.name)) {
        throw new Error('Column in definitions is not specified.');
      }

      return ` ${column.name} ${this.#getColumnType(column.type)} ${this.#createConstraintClause(column.constraints)} `;
    });

    return definitionArr;
  };

  #createConstraintClause = (constraints) => {
    if (empty(constraints)) {
      return '';
    }

    let constraintClause = '';
    Object.keys(constraints).forEach((constraint) => {
      const value = constraints[constraint];
      if (value) {
        switch (constraint) {
          case 'required':
            constraintClause += ' NOT NULL ';
            break;
          case 'unique':
            constraintClause += ' UNIQUE ';
            break;
          case 'primary_key':
            constraintClause += ' PRIMARY KEY ';
            break;
          case 'auto_increment':
            if (constraints.primary_key) {
              constraintClause += ' AUTOINCREMENT ';
            }
            break;
          case 'default':
            if (value instanceof RawSQL) {
              constraintClause += ` DEFAULT (${value.rawSQL}) `;
            } else if (value === 'CURRENT_TIMESTAMP') {
              constraintClause += " DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime')) ";
            } else if (typeof value === 'string' || typeof value === 'number') {
              constraintClause += ` DEFAULT ${this.escape(value)} `;
            }
            break;
          case 'check':
            constraintClause += ` CHECK (${this.#createConditionStr(value)}) `;
            break;
          default:
        }
      }
    });

    return constraintClause;
  };

  #createLimitClause = (limit, offset) => {
    let limitClause = '';
    const limitArgs = [];

    if (!empty(limit)) {
      limitClause += ' LIMIT ? ';
      limitArgs.push(limit);

      if (!empty(offset)) {
        limitClause += ' OFFSET ? ';
        limitArgs.push(offset);
      }
    }

    return { limitClause, limitArgs };
  };

  #createOrderByClause = (orderBy) => {
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

  #createSetClause = (values) => {
    const setClauseArr = [];
    const setArgs = [];

    Object.keys(values).forEach((column) => {
      setClauseArr.push(` ${column} = ? `);
      setArgs.push(values[column]);
    });

    return {
      setClause: ` SET ${setClauseArr.join(',')} `,
      setArgs,
    };
  };

  #createWhereClause = (condition) => {
    const whereArgs = [];
    const conditionStr = this.#createConditionStr(condition, whereArgs);
    const whereClause = empty(conditionStr) ? '' : ` WHERE ${conditionStr} `;

    return { whereClause, whereArgs };
  };

  #createValuesClause = (valueObj) => {
    const columns = [];
    const values = [];

    Object.keys(valueObj).forEach((key) => {
      columns.push(key);
      values.push(valueObj[key]);
    });

    const placeholders = Array(values.length).fill('?');

    return { columns, values, placeholders };
  }

  #getColumnType = (type) => {
    if (typeof type !== 'string') {
      return '';
    }

    switch (type.toUpperCase()) {
      case 'NULL':
        return 'NULL';
      case 'INT':
      case 'INTEGER':
        return 'INTEGER';
      case 'FLOAT':
      case 'DOUBLE':
      case 'REAL':
        return 'REAL';
      case 'CAHR':
      case 'VARCHAR':
      case 'STRING':
      case 'TEXT':
      case 'DATETIME':
      case 'TIMESTAMP':
        return 'TEXT';
      case 'BLOB':
        return 'BLOB';
      default:
    }

    return '';
  };

  #getSqlStmt = (method, ...methodArgs) => {
    switch (method) {
      case 'createTable': {
        const [tableName, columns] = methodArgs;
        const definitionArr = this.#createColumnDefinitionArr(columns);
        const sqlStmt = `CREATE TABLE IF NOT EXISTS ${tableName} (${definitionArr.join(',')})`;

        return { sqlStmt, args: [] };
      }
      case 'renameTable': {
        const [oldName, newName] = methodArgs;
        const sqlStmt = `ALTER TABLE ${oldName} RENAME TO ${newName}`;

        return { sqlStmt, args: [] };
      }
      case 'dropTable': {
        const [tableName] = methodArgs;
        const sqlStmt = `DROP TABLE IF EXISTS ${tableName}`;

        return { sqlStmt, args: [] };
      }
      case 'addColumn': {
        const [tableName, column] = methodArgs;
        const definitionArr = this.#createColumnDefinitionArr([column]);
        const sqlStmt = `ALTER TABLE ${tableName} ADD COLUMN ${definitionArr[0]}`;

        return { sqlStmt, args: [] };
      }
      case 'dropColumn': {
        const [tableName, column] = methodArgs;
        const sqlStmt = `ALTER TABLE ${tableName} DROP COLUMN ${column}`;

        return { sqlStmt, args: [] };
      }
      case 'insert': {
        const [tableName, valueObj] = methodArgs;
        const { values, columns, placeholders } = this.#createValuesClause(valueObj);
        const sqlStmt = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;

        return { sqlStmt, args: values };
      }
      case 'select': {
        const [tableName, columns, condition, orderBy, limit, offset] = methodArgs;
        const { whereClause, whereArgs } = this.#createWhereClause(condition);
        const orderByClause = this.#createOrderByClause(orderBy);
        const { limitClause, limitArgs } = this.#createLimitClause(limit, offset);

        const sqlStmt = `SELECT ${columns.join(', ')} FROM ${tableName} ${whereClause} ${orderByClause} ${limitClause};`;
        const args = whereArgs.concat(limitArgs);

        return { sqlStmt, args };
      }
      case 'update': {
        const [tableName, values, condition] = methodArgs;
        const { setClause, setArgs } = this.#createSetClause(values);
        const { whereClause, whereArgs } = this.#createWhereClause(condition);
        const sqlStmt = `UPDATE ${tableName} ${setClause} ${whereClause};`;
        const args = setArgs.concat(whereArgs);

        return { sqlStmt, args };
      }
      case 'delete': {
        const [tableName, condition] = methodArgs;
        const { whereClause, whereArgs } = this.#createWhereClause(condition);
        const sqlStmt = `DELETE FROM ${tableName} ${whereClause};`;
        const args = whereArgs;

        return { sqlStmt, args };
      }
      default:
    }

    return { sqlStmt: '', args: [] };
  };

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

    if (['IS_NULL', 'ISNULL', 'NULL'].includes(op)) {
      return 'IS NULL';
    }

    if (['IS_NOT_NULL', 'NOT_NULL', 'ISNOTNULL', 'NOTNULL'].includes(op)) {
      return 'IS NOT NULL';
    }

    return op;
  };
}
