import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetJenisCutiQuery } from './GetJenisCutiQuery';
import { getConnection } from 'typeorm';
import { JenisCuti } from '../../infrastructure/orm/JenisCuti';

@injectable()
export class GetJenisCutiQueryHandler implements IQueryHandler<GetJenisCutiQuery, any> {
  queryToHandle = GetJenisCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetJenisCutiQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(JenisCuti).findOneOrFail({
        where: {
          id: query.id
        },
    })
  }
}
