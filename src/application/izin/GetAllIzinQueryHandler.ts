import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllIzinQuery } from './GetAllIzinQuery';
import { FindManyOptions, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class GetAllIzinQueryHandler implements IQueryHandler<GetAllIzinQuery, any> {
  queryToHandle = GetAllIzinQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllIzinQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    const data:FindManyOptions<Izin> = {
        take: query.take,
        skip: query.skip,
        relations: {
          JenisIzin: true,
        },
    }
    if(query.nidn!=null){
      const filter = {...data, where: { nidn: query.nidn }}
      const record = await _db.getRepository(Izin).findAndCount(filter)
      logger.info({filter:filter, izin:record})
      return record
    }
    else if(query.nip!=null){
      const filter = {...data, where: { nip: query.nip }}
      const record = await _db.getRepository(Izin).findAndCount(filter)
      logger.info({filter:filter, izin:record})
      return record
    } else{
      const record = await _db.getRepository(Izin).findAndCount(data)
      logger.info({filter:data, izin:record})
      return record
    }
  }
}