import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllCutiQuery } from './GetAllCutiQuery';
import { FindManyOptions, getConnection } from 'typeorm';
import { Cuti } from '../../infrastructure/orm/Cuti';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class GetAllCutiQueryHandler implements IQueryHandler<GetAllCutiQuery, any> {
  queryToHandle = GetAllCutiQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllCutiQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    const data:FindManyOptions<Cuti> = {
        take: query.take,
        skip: query.skip,
        relations: {
          JenisCuti: true,
        },
    }

    if(query.nidn!=null){
      const filter = {...data, where: { nidn: query.nidn }}
      const record = await _db.getRepository(Cuti).findAndCount(filter)
      logger.info({filter:filter, cuti:record})
      return record
    }
    else if(query.nip!=null){
      const filter = {...data, where: { nip: query.nip }}
      const record = await _db.getRepository(Cuti).findAndCount(filter)
      logger.info({filter:filter, cuti:record})
      return record
    } else{
      const record = await _db.getRepository(Cuti).findAndCount(data)
      logger.info({filter:data, cuti:record})
      return record
    }
  }
}
