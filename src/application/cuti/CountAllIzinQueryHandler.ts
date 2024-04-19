import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllIzinQuery } from './CountAllIzinQuery';
import { In, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class CountAllIzinQueryHandler implements IQueryHandler<CountAllIzinQuery, any> {
  queryToHandle = CountAllIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllIzinQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Izin).findAndCount()
  }
}
