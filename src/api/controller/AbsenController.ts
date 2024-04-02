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

@controller('/absen')
export class AbsenController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/check/:nidn/:tanggal')
    async check(@request() req: Request, @response() res: Response) {
        let absensi = null;
        const query: GetAbsenQuery = new GetAbsenQuery(req.params.nidn, req.params.tanggal);
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

            const jarak = distance(req.body.lat, req.body.long, -6.599398, 106.812367, "Meter");
            if (!(jarak >= 0 && jarak <= 800)) {
                throw new Error(`jaran anda dengan unpak sejauh ${jarak} meter, itu berada di luar lokasi radius absensi (150 meter)`)
            }
            absensi = await this._commandBus.send(
                new CreateAbsenMasukCommand(req.body.nidn, req.body.tanggal, req.body.absen_masuk)
            );
            message = "berhasil absen masuk";
        } else if (req.params.tipe == "keluar") {
            await absenKeluarSchema.validate(req.body, { abortEarly: false });

            const query: GetAbsenQuery = new GetAbsenQuery(req.body.nidn, req.body.tanggal);
            const absen = await this._queryBus.execute(query);
            if (absen.absen_keluar == null) {
                absensi = await this._commandBus.send(
                    new CreateAbsenKeluarCommand(absen.nidn, absen.tanggal, req.body.absen_keluar)
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