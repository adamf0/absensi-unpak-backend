import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllIzinOnWaitingQuery } from './CountAllIzinOnWaitingQuery';
import { In, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

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
