import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAbsenQuery } from './GetAbsenQuery';
import { getConnection } from 'typeorm';
import { Absen } from '../../infrastructure/orm/Absen';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class GetAbsenQueryHandler implements IQueryHandler<GetAbsenQuery, any> {
  queryToHandle = GetAbsenQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAbsenQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    if(query.nidn){
      const record = await _db.getRepository(Absen).findOneBy({
        nidn: query.nidn,
        tanggal: query.tanggal,
      })
      logger.info({filter:{
        nidn: query.nidn,
        tanggal: query.tanggal,
      }, absen: record})

      return record
    } else if(query.nip){
      const record = await _db.getRepository(Absen).findOneBy({
        nip: query.nip,
        tanggal: query.tanggal,
      })
      logger.info({filter:{
        nip: query.nip,
        tanggal: query.tanggal,
      }, absen: record})

      return record
    }
    throw new Error("invalid command GetAbsenQueryHandler")
  }
}
