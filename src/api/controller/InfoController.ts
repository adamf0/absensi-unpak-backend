import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { GetAbsenByFilterQuery } from '../../application/absen/GetAbsenByFilterQuery';
import { CountAllCutiQuery } from '../../application/cuti/CountAllCutiQuery';
import { CountAllIzinQuery } from '../../application/cuti/CountAllIzinQuery';
import moment from 'moment';
import 'moment-timezone';
import { logger } from '../../infrastructure/config/logger';

@controller('/info')
export class InfoController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }


    isLate(absen) {
        const currentTime = moment(absen.absen_masuk).tz('Asia/Jakarta');
        const absenTime = moment("08:00:00", 'HH:mm:ss').tz('Asia/Jakarta');
        return currentTime.isAfter(absenTime);
    }

    is8Hour(absen) {
        const masuk = moment(absen.absen_masuk).tz('Asia/Jakarta')
        return masuk.isAfter(masuk.startOf('day').add(8, 'hours'));
    }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        let nidn, nip, tanggal_awal, tanggal_akhir
        nidn = req.query?.nidn == undefined || req.query?.nidn == "null" ? null : req.query.nidn
        nip = req.query?.nip == undefined || req.query?.nip == "null" ? null : req.query.nip
        tanggal_awal = req.query?.tanggal_awal == undefined || req.query?.tanggal_awal == "null" ? null : req.query?.tanggal_awal
        tanggal_akhir = req.query?.tanggal_akhir == undefined || req.query?.tanggal_akhir == "null" ? null : req.query?.tanggal_akhir

        const [listCuti, countCuti] = await this._queryBus.execute(
            new CountAllCutiQuery(nidn, nip, tanggal_awal, tanggal_akhir)
        );
        const [listIzin, countIzin] = await this._queryBus.execute(
            new CountAllIzinQuery(nidn, nip, tanggal_awal, tanggal_akhir)
        );
        const [absen, _] = await this._queryBus.execute(
            new GetAbsenByFilterQuery(nidn, nip, tanggal_awal, tanggal_akhir)
        );

        const absen_masuk = (absen??[]).filter(a => a.absen_masuk != null).length
        const absen_tidak_masuk = (absen??[]).filter(a => a.absen_masuk == null && a.absen_keluar == null).length
        const absen_8jam = (absen??[]).filter(a => a.absen_masuk != null && this.is8Hour(a)).length
        const absen_kurang8jam = (absen??[]).filter(a => a.absen_masuk != null && !this.is8Hour(a)).length
        const absen_tepat = (absen??[]).filter(a => a.absen_masuk != null && !this.isLate(a)).length
        const absen_telat = (absen??[]).filter(a => a.absen_masuk != null && this.isLate(a)).length

        const izin_tunggu = (listIzin??[]).filter(izin => izin.status == "menunggu" || izin.status == "").length
        const izin_tolak = (listIzin??[]).filter(izin => izin.status == "tolak").length
        const izin_terima = (listIzin??[]).filter(izin => izin.status == "terima").length

        const cuti_tunggu = (listCuti??[]).filter(izin => izin.status == "menunggu" || izin.status == "").length
        const cuti_tolak = (listCuti??[]).filter(izin => izin.status == "tolak").length
        const cuti_terima = (listCuti??[]).filter(izin => izin.status == "terima").length

        logger.info({
            absen:absen,
            absen_masuk:absen_masuk,
            absen_tidak_masuk:absen_tidak_masuk,
            absen_8jam:absen_8jam,
            absen_kurang8jam:absen_kurang8jam,
            absen_tepat:absen_tepat,
            absen_telat:absen_telat,

            izin_tunggu:izin_tunggu,
            izin_tolak:izin_tolak,
            izin_terima:izin_terima,

            cuti_tunggu:cuti_tunggu,
            cuti_tolak:cuti_tolak,
            cuti_terima:cuti_terima,
        })
        res.status(200).json({
            status: 200,
            message: null,
            data: {
                absen: {
                    masuk: absen_masuk,
                    tidak_masuk: absen_tidak_masuk, //mundur 1 hari
                    lebih_8jam: absen_8jam,
                    kurang_8jam: absen_kurang8jam,
                    tepat_waktu: absen_tepat,
                    telat: absen_telat,
                },
                izin: {
                    total: countIzin,
                    menunggu: izin_tunggu,
                    tolak: izin_tolak,
                    terima: izin_terima,
                },
                cuti: {
                    total: countCuti,
                    menunggu: cuti_tunggu,
                    tolak: cuti_tolak,
                    terima: cuti_terima,
                },
            },
            list: null,
            validation: [],
            log: [],
        });
    }
}