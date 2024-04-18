import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllPenggunaQuery } from './GetAllPenggunaQuery';
import { getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class GetAllPenggunaQueryHandler implements IQueryHandler<GetAllPenggunaQuery, any> {
  queryToHandle = GetAllPenggunaQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllPenggunaQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(User).findAndCount(
      {
        // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
        take: query.take,
        skip: query.skip
      },
    )
  }
}
