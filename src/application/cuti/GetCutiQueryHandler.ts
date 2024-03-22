import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetCutiQuery } from './GetCutiQuery';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class GetCutiQueryHandler implements IQueryHandler<GetCutiQuery, any> {
  queryToHandle = GetCutiQuery.name;
  _db: DataSource;

  constructor(
    // @inject(TYPES.ApiServer) private readonly _db: AppDataSource
  ) {
    this._db = AppDataSource.initialize();
  }

  async execute(query: GetCutiQuery) {
    return await this._db.getRepository(Cuti).findOneByOrFail({
        id: query.id
    })
  }
}
