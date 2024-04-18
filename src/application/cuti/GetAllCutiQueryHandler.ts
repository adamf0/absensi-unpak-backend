import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllCutiQuery } from './GetAllCutiQuery';
import { getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class GetAllCutiQueryHandler implements IQueryHandler<GetAllCutiQuery, any> {
  queryToHandle = GetAllCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllCutiQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Cuti).findAndCount(
      {
        // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
        take: query.take,
        skip: query.skip,
        relations: {
          JenisCuti: true,
        },
      },
    )
  }
}
