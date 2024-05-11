import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllClaimAbsenQuery } from './GetAllClaimAbsenQuery';
import { FindManyOptions, IsNull, Like, Not, getConnection } from 'typeorm';
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

    if(query.nidn!=null){
      const queryBuilder = await _db.getRepository(ClaimAbsen).createQueryBuilder("claim_absen")
      .innerJoinAndSelect("claim_absen.Absen", "absen")
      .where("absen.nidn = :nidn", { nidn: query.nidn })
      .andWhere("(absen.nip LIKE :search OR claim_absen.catatan LIKE :search OR claim_absen.dokumen LIKE :search OR claim_absen.perbaikan_absen_masuk LIKE :search OR claim_absen.perbaikan_absen_keluar LIKE :search OR claim_absen.status LIKE :search OR absen.tanggal LIKE :search OR absen.absen_masuk LIKE :search OR absen.absen_keluar LIKE :search OR absen.catatan_telat LIKE :search OR absen.catatan_pulang LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('claim_absen.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), izin:JSON.stringify(record)})
      return record
    }
    else if(query.nip!=null){
      const queryBuilder = await _db.getRepository(ClaimAbsen).createQueryBuilder("claim_absen")
      .where("absen.nip = :nip", { nip: query.nip })
      .innerJoinAndSelect("claim_absen.Absen", "absen")
      .andWhere("(absen.nidn LIKE :search OR claim_absen.catatan LIKE :search OR claim_absen.dokumen LIKE :search OR claim_absen.perbaikan_absen_masuk LIKE :search OR claim_absen.perbaikan_absen_keluar LIKE :search OR claim_absen.status LIKE :search OR absen.tanggal LIKE :search OR absen.absen_masuk LIKE :search OR absen.absen_keluar LIKE :search OR absen.catatan_telat LIKE :search OR absen.catatan_pulang LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('claim_absen.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), izin:JSON.stringify(record)})
      return record
    } else{
      const queryBuilder = await _db.getRepository(ClaimAbsen).createQueryBuilder("claim_absen")
      .innerJoinAndSelect("claim_absen.Absen", "absen")
      .where("(absen.nidn LIKE :search OR absen.nip LIKE :search OR claim_absen.catatan LIKE :search OR claim_absen.dokumen LIKE :search OR claim_absen.perbaikan_absen_masuk LIKE :search OR claim_absen.perbaikan_absen_keluar LIKE :search OR claim_absen.status LIKE :search OR absen.tanggal LIKE :search OR absen.absen_masuk LIKE :search OR absen.absen_keluar LIKE :search OR absen.catatan_telat LIKE :search OR absen.catatan_pulang LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('claim_absen.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), izin:JSON.stringify(record)})
      return record
    }
  }
}
