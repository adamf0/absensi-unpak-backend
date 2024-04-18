import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetPenggunaQuery } from './GetPenggunaQuery';
import { getConnection } from 'typeorm';
import { User } from '../../infrastructure/orm/User';

@injectable()
export class GetPenggunaQueryHandler implements IQueryHandler<GetPenggunaQuery, any> {
  queryToHandle = GetPenggunaQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetPenggunaQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(User).findOneOrFail({
        where: {
          id: query.id
        },
    })
  }
}
