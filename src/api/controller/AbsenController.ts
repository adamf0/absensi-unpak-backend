import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { absenKeluarSchema, absenMasukSchema } from '../../domain/validation/absenSchema';
import { CreateAbsenMasukCommand } from '../../application/absen/CreateAbsenMasukCommand';
import { CreateAbsenKeluarCommand } from '../../application/absen/CreateAbsenKeluarCommand';
import { GetAbsenQuery } from '../../application/absen/GetAbsenQuery';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { distance } from '../../infrastructure/utility/Utility';
import { GetAllCutiByNIDNYearMonthQuery } from '../../application/cuti/GetAllCutiByNIDNYearMonthQuery';
import { GetAllIzinByNIDNYearMonthQuery } from '../../application/izin/GetAllIzinByNIDNYearMonthQuery';
import { InvalidRequest } from '../../domain/entity/InvalidRequest';

@controller('/absen')
export class AbsenController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/check/:type/:nidn_nip/:tanggal')
    async check(@request() req: Request, @response() res: Response) {
        let absensi = null;
        const year_month = req.params.tanggal.split('-').slice(0, 2).join('-');

        let list_cuti = await this._queryBus.execute(
            new GetAllCutiByNIDNYearMonthQuery(
                req.params?.type=="nidn"? req.params?.nidn_nip:null, 
                req.params?.type=="nip"? req.params?.nidn_nip:null, 
                year_month
            )
        );
        list_cuti = list_cuti.reduce((acc, item) => {
            for (let i = 0; i < item.lama_cuti; i++) {
                const tanggal = new Date(new Date(item.tanggal_pengajuan).getTime() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
                const cutiObj = {
                    id: item.id,
                    tanggal: tanggal,
                    type: "cuti",
                    tujuan: item.tujuan,
                    jenis_cuti: item.jenis_cuti,
                    JenisCuti: item.JenisCuti
                };
                if (item.status=="terima" && req.params.tanggal == tanggal) {
                    acc.push(cutiObj);
                }
            }
            return acc;
        }, [])

        if (list_cuti.length > 0) {
            const cuti = list_cuti[0]
            throw new InvalidRequest("terdaftar_cuti", `hari ini anda masih cuti ${cuti.JenisCuti.nama}`);
        }

        let list_izin = await this._queryBus.execute(
            new GetAllIzinByNIDNYearMonthQuery(
                req.params?.type=="nidn"? req.params?.nidn_nip:null, 
                req.params?.type=="nip"? req.params?.nidn_nip:null, 
                year_month
            )
        );
        list_izin = list_izin.reduce((acc, item) => {
            if (item.status=="terima" && req.params.tanggal == new Date(item.tanggal_pengajuan).toISOString().split('T')[0]) {
                acc.push(item);
            }
            return acc
        }, [])
        if (list_izin.length > 0) {
            const izin = list_izin[0]
            throw new InvalidRequest("terdaftar_izin", `hari ini anda sudah izin dengan tujuan "${izin.tujuan}"`);
        }

        const query: GetAbsenQuery = new GetAbsenQuery(
            req.params?.type=="nidn"? req.params?.nidn_nip:null, 
            req.params?.type=="nip"? req.params?.nidn_nip:null, 
            req.params.tanggal
        );
        absensi = await this._queryBus.execute(query);

        res.status(200).json({
            status: 200,
            message: absensi == null ? "data tidak ditemukan" : "data ditemukan",
            data: absensi,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/:tipe')
    async absen(@request() req: Request, @response() res: Response) {
        let absensi = null;
        let message = null;
        if (req.params.tipe == "masuk") {
            await absenMasukSchema.validate(req.body, { abortEarly: false });
            const year_month = req.body.tanggal.split('-').slice(0, 2).join('-');

            let list_cuti = await this._queryBus.execute(
                new GetAllCutiByNIDNYearMonthQuery(req.body?.nidn, req.body?.nip, year_month)
            );
            list_cuti = list_cuti.reduce((acc, item) => {
                for (let i = 0; i < item.lama_cuti; i++) {
                    const tanggal = new Date(new Date(item.tanggal_pengajuan).getTime() + (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
                    const cutiObj = {
                        id: item.id,
                        tanggal: tanggal,
                        type: "cuti",
                        tujuan: item.tujuan,
                        jenis_cuti: item.jenis_cuti,
                        JenisCuti: item.JenisCuti
                    };
                    if (item.status=="terima" && req.body.tanggal == tanggal) {
                        acc.push(cutiObj);
                    }
                }
                return acc;
            }, [])

            if (list_cuti.length > 0) {
                const cuti = list_cuti[0]
                throw new InvalidRequest("terdaftar_cuti", `hari ini anda masih cuti ${cuti.JenisCuti.nama}`);
            }

            let list_izin = await this._queryBus.execute(
                new GetAllIzinByNIDNYearMonthQuery(req.body?.nidn,req.body?.nip, year_month)
            );
            list_izin = list_izin.reduce((acc, item) => {
                if (item.status=="terima" && req.body.tanggal == new Date(item.tanggal_pengajuan).toISOString().split('T')[0]) {
                    acc.push(item);
                }
                return acc
            }, [])

            if (list_izin.length > 0) {
                const izin = list_izin[0]
                throw new InvalidRequest("terdaftar_izin", `hari ini anda sudah izin dengan tujuan "${izin.tujuan}"`);
            }

            // const jarak = distance(req.body.lat, req.body.long, -6.599398, 106.812367, "Meter");
            // if (!(jarak >= 0 && jarak <= 800)) {
            //     throw new InvalidRequest("luar_radius", `jaran anda dengan unpak sejauh ${jarak} meter, itu berada di luar lokasi radius absensi (150 meter)`);
            // }
            absensi = await this._commandBus.send(
                new CreateAbsenMasukCommand(req.body?.nidn, req.body?.nip, req.body.tanggal, req.body.absen_masuk, req.body.keterangan)
            );
            message = "berhasil absen masuk";
        } else if (req.params.tipe == "keluar") {
            await absenKeluarSchema.validate(req.body, { abortEarly: false });

            const query: GetAbsenQuery = new GetAbsenQuery(req.body?.nidn, req.body?.nip, req.body.tanggal);
            const absen = await this._queryBus.execute(query);
            if (absen.absen_keluar == null) {
                absensi = await this._commandBus.send(
                    new CreateAbsenKeluarCommand(absen.nidn, absen.nip, absen.tanggal, req.body.absen_keluar, req.body.keterangan)
                );
                message = "berhasil absen keluar";
            } else {
                message = "sudah absen";
                absensi = absen
            }
        } else {
            throw new Error("invalid command")
        }

        res.status(200).json({
            status: 200,
            message: message,
            data: absensi,
            list: null,
            validation: [],
            log: [],
        });
    }
}