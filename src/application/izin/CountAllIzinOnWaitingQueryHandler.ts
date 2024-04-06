import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { CountAllIzinOnWaitingQuery } from './CountAllIzinOnWaitingQuery';
import { DataSource, In, getConnection } from 'typeorm';
import { AppDataSource } from '../../infrastructure/config/mysql';
import { Izin } from '../../infrastructure/orm/Izin';
import { count } from 'console';

@injectable()
export class CountAllIzinOnWaitingQueryHandler implements IQueryHandler<CountAllIzinOnWaitingQuery, any> {
  queryToHandle = CountAllIzinOnWaitingQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllIzinOnWaitingQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Izin).findAndCount(
      {
        where: { status: In(["","menunggu"]) },
      },
    )
  }
}
