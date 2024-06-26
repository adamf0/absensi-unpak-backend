import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CountAllCutiOnWaitingQuery } from './CountAllCutiOnWaitingQuery';
import { FindManyOptions, In, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CountAllCutiOnWaitingQueryHandler implements IQueryHandler<CountAllCutiOnWaitingQuery, any> {
  queryToHandle = CountAllCutiOnWaitingQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CountAllCutiOnWaitingQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    // console.info(query)
    const data:FindManyOptions<Cuti> = {
      where: { 
        status: In(["", "menunggu"]), 
      }
    }   

    if (query.nidn !== null) {
      const filter = {...data,where:{...data.where,nidn: query.nidn}}
      const record = await _db.getRepository(Cuti).findAndCount(filter)
      logger.info({filter:JSON.stringify(filter), cuti: JSON.stringify(record)})
      return record
    } else if (query.nip !== null) {
      const filter = {...data,where:{...data.where,nip: query.nip}}
      const record = await _db.getRepository(Cuti).findAndCount(filter)
      logger.info({filter:JSON.stringify(filter), cuti: JSON.stringify(record)})
      return record
    } else{
      const record = await _db.getRepository(Cuti).findAndCount(data)
      logger.info({filter:JSON.stringify(data), cuti: JSON.stringify(record)})
      return record
    }
  }
}
