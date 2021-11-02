import BaseSQL from './BaseSQL';
import SQLite from './SQLite';
import RawSQL from './type/RawSQL';

export default class Database extends SQLite {}

export {
  BaseSQL,
  SQLite,
  RawSQL,
};
