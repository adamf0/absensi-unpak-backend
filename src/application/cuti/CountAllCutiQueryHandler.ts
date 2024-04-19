import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllCutiQuery } from './CountAllCutiQuery';
import { In, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class CountAllCutiQueryHandler implements IQueryHandler<CountAllCutiQuery, any> {
  queryToHandle = CountAllCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllCutiQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Cuti).findAndCount()
  }
}
