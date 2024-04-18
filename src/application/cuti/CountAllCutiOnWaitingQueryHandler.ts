import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllCutiOnWaitingQuery } from './CountAllCutiOnWaitingQuery';
import { In, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class CountAllCutiOnWaitingQueryHandler implements IQueryHandler<CountAllCutiOnWaitingQuery, any> {
  queryToHandle = CountAllCutiOnWaitingQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllCutiOnWaitingQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Cuti).findAndCount(
      {
        where: { status: In(["","menunggu"]) },
      },
    )
  }
}
