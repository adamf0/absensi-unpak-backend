import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetIzinQuery } from './GetIzinQuery';
import { DataSource, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class GetIzinQueryHandler implements IQueryHandler<GetIzinQuery, any> {
  queryToHandle = GetIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetIzinQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Izin).findOneByOrFail({
        id: query.id
    })
  }
}
