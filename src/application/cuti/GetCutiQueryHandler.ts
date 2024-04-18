import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetCutiQuery } from './GetCutiQuery';
import { getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';

@injectable()
export class GetCutiQueryHandler implements IQueryHandler<GetCutiQuery, any> {
  queryToHandle = GetCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetCutiQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(Cuti).findOneOrFail({
        where: {
          id: query.id
        },
        relations: {
          JenisCuti: true,
        },
    })
  }
}
