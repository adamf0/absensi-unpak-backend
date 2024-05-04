import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllClaimAbsenQuery } from './GetAllClaimAbsenQuery';
import { FindManyOptions, getConnection } from 'typeorm';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';
import { logger } from '../../infrastructure/config/logger';
import { Absen } from '../../infrastructure/orm/Absen';

@injectable()
export class GetAllClaimAbsenQueryHandler implements IQueryHandler<GetAllClaimAbsenQuery, any> {
  queryToHandle = GetAllClaimAbsenQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllClaimAbsenQuery) {
    logger.info({payload:query})
    const _db = await getConnection("default");
    const data:FindManyOptions<ClaimAbsen> = {
        take: query.take,
        skip: query.skip,
        relations: {
          Absen: true,
        },
    }

    if(query.nidn!=null){
      const absen = await _db.getRepository(Absen).findOneOrFail({
        where:{
          nidn: query.nidn
        }
      })
      const filter = {...data, where: { Absen : absen }}
      const record = await _db.getRepository(ClaimAbsen).findAndCount(filter)
      logger.info({filter:filter, Absen:record})
      return record
    }
    else if(query.nip!=null){
      const absen = await _db.getRepository(Absen).findOneOrFail({
        where:{
          nip: query.nip
        }
      })
      const filter = {...data, where: { Absen : absen }}
      const record = await _db.getRepository(ClaimAbsen).findAndCount(filter)
      logger.info({filter:filter, Absen:record})
      return record
    } else{
      const record = await _db.getRepository(ClaimAbsen).findAndCount(data)
      logger.info({filter:data, Absen:record})
      return record
    }
  }
}
