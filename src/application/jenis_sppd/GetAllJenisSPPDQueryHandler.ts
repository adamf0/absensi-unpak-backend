import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllJenisSPPDQuery } from './GetAllJenisSPPDQuery';
import { getConnection } from 'typeorm';
import { JenisSPPD } from '../../infrastructure/orm/JenisSPPD';

@injectable()
export class GetAllJenisSPPDQueryHandler implements IQueryHandler<GetAllJenisSPPDQuery, any> {
  queryToHandle = GetAllJenisSPPDQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllJenisSPPDQuery) {
    const _db = await getConnection("default");
    return await (query.take == null && query.skip == null? 
      _db.getRepository(JenisSPPD).find():
      _db.getRepository(JenisSPPD).findAndCount(
        {
          // where: { name: Like('%' + keyword + '%') }, order: { name: "DESC" },
          take: query.take,
          skip: query.skip,
        },
      )
    )
  }
}
