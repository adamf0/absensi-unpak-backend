import { injectable } from 'inversify';
import { IQueryHandler } from '../../infrastructure/abstractions/messaging/IQueryHandler';
import { GetAllSPPDQuery } from './GetAllSPPDQuery';
import { getConnection } from 'typeorm';
import { logger } from '../../infrastructure/config/logger';
import { SPPD } from '../../infrastructure/orm/SPPD';

@injectable()
export class GetAllSPPDQueryHandler implements IQueryHandler<GetAllSPPDQuery, any> {
  queryToHandle = GetAllSPPDQuery.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async execute(query: GetAllSPPDQuery) {
    const _db = await getConnection("default");
    
    if(query.nidn!=null){
      const queryBuilder = await _db.getRepository(SPPD).createQueryBuilder("sppd")
      .leftJoinAndSelect("sppd.jenisSppd", "jenisSppd")
      .leftJoinAndSelect("sppd.anggota", "sppd_anggota")
      .where("sppd.nidn", { nidn: query.nidn })
      .andWhere("(sppd.nidn LIKE :search OR (sppd_anggota.nidn LIKE :search OR sppd_anggota.nip LIKE :search) OR jenisSppd.nama LIKE :search OR sppd.tujuan LIKE :search OR sppd.tanggal_berangkat LIKE :search OR sppd.tanggal_kembali LIKE :search OR sppd.keterangan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('sppd.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), sppd:JSON.stringify(record)})
      return record
    }
    else if(query.nip!=null){
      const queryBuilder = await _db.getRepository(SPPD).createQueryBuilder("sppd")
      .leftJoinAndSelect("sppd.jenisSppd", "jenisSppd")
      .leftJoinAndSelect("sppd.anggota", "sppd_anggota")
      .where("sppd.nip", { nip: query.nip })
      .andWhere("(sppd.nip LIKE :search OR (sppd_anggota.nip LIKE :search OR sppd_anggota.nip LIKE :search) OR jenisSppd.nama LIKE :search OR sppd.tujuan LIKE :search OR sppd.tanggal_berangkat LIKE :search OR sppd.tanggal_kembali LIKE :search OR sppd.keterangan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('sppd.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), sppd:JSON.stringify(record)})
      return record
    } else{
      const queryBuilder = await _db.getRepository(SPPD).createQueryBuilder("sppd")
      .leftJoinAndSelect("sppd.jenisSppd", "jenisSppd")
      .leftJoinAndSelect("sppd.anggota", "sppd_anggota")
      .andWhere("(sppd.nip LIKE :search OR sppd.nidn LIKE :search OR (sppd_anggota.nidn LIKE :search OR sppd_anggota.nip LIKE :search) OR jenisSppd.nama LIKE :search OR sppd.tujuan LIKE :search OR sppd.tanggal_berangkat LIKE :search OR sppd.tanggal_kembali LIKE :search OR sppd.keterangan LIKE :search)", { search: `%${query.search??""}%` })
      .orderBy('sppd.id','DESC')
      .take(query.take)
      .skip(query.skip)

      const record = queryBuilder.getManyAndCount();
      logger.info({filter:queryBuilder.getQueryAndParameters(), sppd:JSON.stringify(record)})
      return record
    }
  }
}
