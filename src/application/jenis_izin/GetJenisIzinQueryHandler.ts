import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetJenisIzinQuery } from './GetJenisIzinQuery';
import { getConnection } from 'typeorm';
import { JenisIzin } from '../../infrastructure/orm/JenisIzin';

@injectable()
export class GetJenisIzinQueryHandler implements IQueryHandler<GetJenisIzinQuery, any> {
  queryToHandle = GetJenisIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetJenisIzinQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(JenisIzin).findOneOrFail({
        where: {
          id: query.id
        },
    })
  }
}
