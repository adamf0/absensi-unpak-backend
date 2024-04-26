import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllIzinOnWaitingQuery } from './CountAllIzinOnWaitingQuery';
import { FindManyOptions, In, getConnection } from 'typeorm';
import { Izin } from '../../infrastructure/orm/Izin';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CountAllIzinOnWaitingQueryHandler implements IQueryHandler<CountAllIzinOnWaitingQuery, any> {
  queryToHandle = CountAllIzinOnWaitingQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllIzinOnWaitingQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    // console.log(query)
    const data:FindManyOptions<Izin> = {
      where: { 
        status: In(["", "menunggu"]), 
      }
    }   

    if (query.nidn !== null) {
      const filter = {...data,where:{...data.where,nidn: query.nidn}}
      const record = await _db.getRepository(Izin).findAndCount(filter)
      logger.info({filter:filter, izin:record})
      return record
    } else if (query.nip !== null) {
      const filter = {...data,where:{...data.where,nip: query.nip}}
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
