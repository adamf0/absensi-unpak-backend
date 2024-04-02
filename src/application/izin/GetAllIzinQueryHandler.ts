import { inject, injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { TYPES } from '../../infrastructure/types';
import { GetAllIzinQuery } from './GetAllIzinQuery';
import { DataSource } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class GetAllIzinQueryHandler implements IQueryHandler<GetAllIzinQuery, any> {
  queryToHandle = GetAllIzinQuery.name;
  // _db: DataSource;

  constructor(
    @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllIzinQuery) {
    return await this._db.getRepository(Izin).findAndCount(
        {
            // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
            take: query.take,
            skip: query.skip
        }
    )
  }
}
