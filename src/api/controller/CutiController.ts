import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { EntityMetadataNotFoundError, IsNull, QueryFailedError } from 'typeorm';
import { CreateCutiCommand } from '../../application/cuti/CreateCutiCommand';
import { UpdateCutiCommand } from '../../application/cuti/UpdateCutiCommand';
import { DeleteCutiCommand } from '../../application/cuti/DeleteCutiCommand';
import { GetAllCutiQuery } from '../../application/cuti/GetAllCutiQuery';
import { GetCutiQuery } from '../../application/cuti/GetCutiQuery';

@controller('/cuti')
export class CutiController {
  constructor(
    @inject(TYPES.Log) private readonly _log: ILog,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  @httpGet('/')
  async index(@request() req: Request, @response() res: Response) {
      try {
        const page = parseInt(String(req.query?.page??"1"));
        const pageSize = parseInt(String(req.query?.pageSize??"10"));
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;

        const [data,count] = await this._queryBus.execute(
            new GetAllCutiQuery(pageSize,startIndex)
        );
        const totalPage=Math.ceil(count/pageSize);
        const nextPage=(page+1 > totalPage) ? null :page+1;
        const prevPage=(page-1 < 1) || (totalPage<page) ? null :page-1;

        res.status(200).json({
            status: 200,
            message: null,
            data: null,
            list: {
                totalData: count,
                startIndex: startIndex,
                endIndex: endIndex,

                totalPage: totalPage,
                pageSize: pageSize,
                prevPage: prevPage,
                // {
                //     number: prevPage??null,
                //     link: prevPage!==null? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${prevPage}`):null
                // },
                currentPage: page,
                // {
                //     number: page,
                //     link: req.protocol + "://" + req.get('host') + req.originalUrl
                // },
                nextPage: nextPage,
                // {
                //     number: nextPage??null,
                //     link: nextPage!==null? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${nextPage}`):null
                // },
                data:data
            },
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

  @httpGet('/:id')
  async detail(@request() req: Request, @response() res: Response) {
      try {
        const cuti = await this._queryBus.execute(
            new GetCutiQuery(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: null,
            data: cuti,
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

  @httpPost('/create')
  async store(@request() req: Request, @response() res: Response) {
      try {
        console.log(req.body)

        //masih error jika tidak ada input kalau form-data
        // const validation = absenKeluarSchema.safeParse(req.body);
        // console.log(validation.success)
        // if (validation.success == false) {
        //     throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
        // } else {
            const cuti = await this._commandBus.send(
                new CreateCutiCommand(
                    req.body.nidn,
                    req.body.tanggal_pengajuan,
                    req.body.lama_cuti,
                    req.body.tujuan,
                    req.body.jenis_cuti,
                )
            );

            res.status(200).json({
                status: 200,
                message: "berhasil mengajukan cuti",
                data: cuti,
                list: null,
                validation: [],
                log: [],
            });
        // }
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
        } if (error instanceof EntityMetadataNotFoundError) {
            if(process.env.deploy != "dev"){
                this._log.saveLog(error.message);
            }
            res.status(500).json({
                status: 500,
                message: "error server",
                data: null,
                list: null,
                validation: [],
                log: process.env.deploy == "dev" ? error : "error server",
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

  @httpPost('/update/:id')
  async update(@request() req: Request, @response() res: Response) {
      try {
        console.log(req.body)

        //masih error jika tidak ada input kalau form-data
        // const validation = absenKeluarSchema.safeParse(req.body);
        // console.log(validation.success)
        // if (validation.success == false) {
        //     throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
        // } else {
            const cuti = await this._commandBus.send(
                new UpdateCutiCommand(
                    parseInt(req.params.id),
                    req.body.nidn,
                    req.body.tanggal_pengajuan,
                    req.body.lama_cuti,
                    req.body.tujuan,
                    req.body.jenis_cuti,
                )
            );

            res.status(200).json({
                status: 200,
                message: "berhasil update data cuti",
                data: cuti,
                list: null,
                validation: [],
                log: [],
            });
        // }
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

  @httpPost('/delete/:id')
  async delete(@request() req: Request, @response() res: Response) {
      try {
        console.log(req.body)

        //masih error jika tidak ada input kalau form-data
        // const validation = absenKeluarSchema.safeParse(req.body);
        // console.log(validation.success)
        // if (validation.success == false) {
        //     throw new InvalidRequest("absenKeluarSchema",validation.error.formErrors.fieldErrors);
        // } else {
            const cuti = await this._commandBus.send(
                new DeleteCutiCommand(parseInt(req.params.id))
            );

            res.status(200).json({
                status: 200,
                message: "berhasil hapus pengajuan cuti",
                data: cuti,
                list: null,
                validation: [],
                log: [],
            });
        // }
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