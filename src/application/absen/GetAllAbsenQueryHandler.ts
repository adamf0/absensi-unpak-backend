import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllAbsenQuery } from './GetAllAbsenQuery';
import { FindManyOptions, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';
import { Absen } from '../../infrastructure/orm/Absen';

@injectable()
export class GetAllAbsenQueryHandler implements IQueryHandler<GetAllAbsenQuery, any> {
  queryToHandle = GetAllAbsenQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllAbsenQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    
    if(query.take=="all"){
      const data:FindManyOptions<Absen> = {}

      if(query.nidn!=null){
        const filter = {...data, where: { nidn: query.nidn }}
        const record = await _db.getRepository(Absen).findAndCount(filter)
        logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
        return record
      }
      else if(query.nip!=null){
        const filter = {...data, where: { nip: query.nip }}
        const record = await _db.getRepository(Absen).findAndCount(filter)
        logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
        return record
      } else{
        const record = await _db.getRepository(Absen).findAndCount(data)
        logger.info({filter:JSON.stringify(data), cuti:JSON.stringify(record)})
        return record
      }
    } else{
      const data:FindManyOptions<Absen> = {
          take: query.take,
          skip: query.skip,
      }

      if(query.nidn!=null){
        const filter = {...data, where: { nidn: query.nidn }}
        const record = await _db.getRepository(Absen).findAndCount(filter)
        logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
        return record
      }
      else if(query.nip!=null){
        const filter = {...data, where: { nip: query.nip }}
        const record = await _db.getRepository(Absen).findAndCount(filter)
        logger.info({filter:JSON.stringify(filter), cuti:JSON.stringify(record)})
        return record
      } else{
        const record = await _db.getRepository(Absen).findAndCount(data)
        logger.info({filter:JSON.stringify(data), cuti:JSON.stringify(record)})
        return record
      }
    }
  }
}
