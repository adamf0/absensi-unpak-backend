import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetSPPDQuery } from './GetSPPDQuery';
import { getConnection } from 'typeorm';
import { SPPD } from '../../infrastructure/orm/SPPD';

@injectable()
export class GetSPPDQueryHandler implements IQueryHandler<GetSPPDQuery, any> {
  queryToHandle = GetSPPDQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetSPPDQuery) {
    const _db = await getConnection("default");
    
    return await _db.getRepository(SPPD).findOneOrFail({
        where: {
          id: query.id
        },
        relations: {
          jenisSppd: true,
          anggota: true
        },
    })
  }
}
