import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { absenKeluarSchema, absenMasukSchema } from '../../domain/validation/absenSchema';
import { InvalidRequest } from '../../domain/entity/InvalidRequest';
import { CreateAbsenMasukCommand } from '../../application/absen/CreateAbsenMasukCommand';
import { CreateAbsenKeluarCommand } from '../../application/absen/CreateAbsenKeluarCommand';
import { GetAbsenQuery } from '../../application/absen/GetAbsenQuery';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { QueryFailedError } from 'typeorm';
import { distance } from '../../infrastructure/utility/Utility';

@controller('/absen')
export class AbsenController {
  constructor(
    @inject(TYPES.Log) private readonly _log: ILog,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  @httpPost('/:tipe')
  async absen(@request() req: Request, @response() res: Response) {
      try {
        let absensi = null;
        let message = null;
        if (req.params.tipe == "masuk") {
            //masih error jika tidak ada input kalau form-data
            const validation = absenMasukSchema.safeParse(req.body);
            console.log(validation.success)
            if (validation.success == false) {
                throw new InvalidRequest("absenMasukSchema",validation.error.formErrors.fieldErrors);
            } else {
                const jarak = distance(req.body.lat, req.body.long, -6.599398, 106.812367, "Meter");
                if(!(jarak>=0 && jarak<=150)){
                    throw new Error("tidak berada dalam lokasi radius absensi (150 meter)")
                }
                absensi = await this._commandBus.send(
                  new CreateAbsenMasukCommand(req.body.nidn, req.body.tanggal, req.body.absen_masuk)
                );
                message = "berhasil absen masuk";
            }
        } else if (req.params.tipe == "keluar") {
            //masih error jika tidak ada input kalau form-data
            const validation = absenKeluarSchema.safeParse(req.body);
            console.log(validation.success)
            if (validation.success == false) {
                throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
            } else {
                const query: GetAbsenQuery = new GetAbsenQuery(req.params.nidn,req.params.tanggal);
                const absen = await this._queryBus.execute(query);                
                absensi = await this._commandBus.send(
                  new CreateAbsenKeluarCommand(absen.nidn, absen.tanggal, req.body.absen_keluar)
                );
                message = "berhasil absen keluar";
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
    } catch (error) {
        console.error(error.constructor);
        if (error instanceof QueryFailedError) {
            if(process.env.deploy != "dev"){
                this._log.saveLog(error.driverError);
            }
            res.status(500).json({
                status: 500,
                message: "error server",
                data: null,
                list: null,
                validation: [],
                log: process.env.deploy == "dev" ? error.driverError : "error server",
            });
        } else {
            if(error.name.IsNull){
                if(process.env.deploy != "dev"){
                    this._log.saveLog(error.message);
                }
                res.status(500).json({
                    status: 500,
                    message: error.message,
                    data: null,
                    list: null,
                    validation: [],
                    log: [],
                });
            } else{
                if(process.env.deploy != "dev"){
                    this._log.saveLog(JSON.stringify(error?.message??[]));
                }
                res.status(500).json({
                    status: 500,
                    message: null,
                    data: null,
                    list: null,
                    validation: error?.message??[],
                    log: [],
                });
            }
        }
    }
  }
}