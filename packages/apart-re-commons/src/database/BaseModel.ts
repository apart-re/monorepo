import { Model, snakeCaseMappers } from "objection";
import { DBErrors } from "objection-db-errors";

export abstract class BaseModel extends DBErrors(Model) {
  created_at!: string;

  updated_at?: string;

  static idColumn = "id";

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static getTableName() {
    return this.tableName;
  }
}

export type { ModelObject } from "objection";
