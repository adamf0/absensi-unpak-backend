import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllCutiQuery } from './GetAllCutiQuery';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class GetAllCutiQueryHandler implements IQueryHandler<GetAllCutiQuery, any> {
  queryToHandle = GetAllCutiQuery.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllCutiQuery) {
    return await this._db.getRepository(Cuti).find()
  }
}
