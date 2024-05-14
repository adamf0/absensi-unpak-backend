import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetJenisSPPDQuery } from './GetJenisSPPDQuery';
import { getConnection } from 'typeorm';
import { JenisSPPD } from '../../infrastructure/orm/JenisSPPD';

@injectable()
export class GetJenisSPPDQueryHandler implements IQueryHandler<GetJenisSPPDQuery, any> {
  queryToHandle = GetJenisSPPDQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetJenisSPPDQuery) {
    const _db = await getConnection("default");
    return await _db.getRepository(JenisSPPD).findOneOrFail({
        where: {
          id: query.id
        },
    })
  }
}
