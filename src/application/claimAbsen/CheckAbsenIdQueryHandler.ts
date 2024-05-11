import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { CheckAbsenIdQuery } from './CheckAbsenIdQuery';
import { Between, FindManyOptions, In, getConnection } from 'typeorm';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';
import { logger } from '../../infrastructure/config/logger';

@injectable()
export class CheckAbsenIdQueryHandler implements IQueryHandler<CheckAbsenIdQuery, any> {
  queryToHandle = CheckAbsenIdQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: CheckAbsenIdQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");

    // const Absen = await _db.getRepository(ClaimAbsen).findOne({
    //   where:{
    //     id: parseInt(query.absenId)
    //   }
    // })
    let data:FindManyOptions<ClaimAbsen> = {
      where:{
        absenId: parseInt(query.absenId)
      },
      relations:{
        Absen: true
      }
    }

    const record = await _db.getRepository(ClaimAbsen).findAndCount(data)
    logger.info({filter:JSON.stringify(data), cuti:JSON.stringify(record)})
    return record
  }
}
