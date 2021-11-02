import Database, { BaseSQL } from '../database';
import Migration from './Migration';
import MigrationsTable from '../MigrationsTable';

export default class MigrationController {
  #db;

  #completedMigrations;

  constructor(db = null) {
    this.db = db || new Database();
    this.#completedMigrations = [];
  }

  get db() {
    return this.#db;
  }

  set db(value) {
    if (value instanceof BaseSQL) {
      this.#db = value;
    } else {
      throw new RangeError('Database must be an instance of BaseSQL.');
    }
  }

  get completedMigrations() {
    return this.#completedMigrations;
  }

  async init() {
    const migrationsTable = new MigrationsTable(this.db);
    await this.db.createTable(
      'migrations',
      [
        {
          name: 'id',
          type: 'INTEGER',
          constraints: {
            required: true,
            primary_key: true,
            auto_increment: true,
          },
        },
        {
          name: 'migration_name',
          type: 'TEXT',
          constraints: {
            required: true,
          },
        },
      ],
    );
    const result = await migrationsTable.select(['migration_name']);
    result._array.forEach((obj) => {
      this.#completedMigrations.push(obj.migration_name);
    });
  }

  async migrate(migrations) {
    // eslint-disable-next-line no-restricted-syntax
    for await (const m of migrations) {
      // eslint-disable-next-line new-cap
      const migration = new m();
      if (!(migration instanceof Migration)) {
        throw new Error('Migration must be an instance of Migration.');
      }
      const migrationName = migration.constructor.name;
      const isMigrated = this.completedMigrations.some(
        (completedMigration) => completedMigration === migrationName,
      );

      if (!isMigrated) {
        let sqlStmts = [];
        migration.migrate();

        migration.blueprints.forEach((blueprint) => {
          sqlStmts = sqlStmts.concat(blueprint.sqlStmts);
        });

        sqlStmts.push({
          method: 'insert',
          args: [
            MigrationsTable.name,
            { migration_name: migrationName },
          ],
        });

        await this.db.transaction(sqlStmts);
      }
    }
  }
}
