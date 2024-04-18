import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllJenisCutiQuery } from './GetAllJenisCutiQuery';
import { getConnection } from 'typeorm';
import { JenisCuti } from '../../infrastructure/orm/JenisCuti';

@injectable()
export class GetAllJenisCutiQueryHandler implements IQueryHandler<GetAllJenisCutiQuery, any> {
  queryToHandle = GetAllJenisCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllJenisCutiQuery) {
    const _db = await getConnection("default");
    return await (query.take == null && query.skip == null? 
      _db.getRepository(JenisCuti).find():
      _db.getRepository(JenisCuti).findAndCount(
        {
          // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
          take: query.take,
          skip: query.skip,
        },
      )
    )
  }
}
