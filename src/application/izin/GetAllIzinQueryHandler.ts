import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllIzinQuery } from './GetAllIzinQuery';
import { getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';

@injectable()
export class GetAllIzinQueryHandler implements IQueryHandler<GetAllIzinQuery, any> {
  queryToHandle = GetAllIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllIzinQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Izin).findAndCount(
        {
            // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
            take: query.take,
            skip: query.skip
        }
    )
  }
}
