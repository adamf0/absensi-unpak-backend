import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { jenisIzinCreateSchema, jenisIzinUpdateSchema } from '../../domain/validation/jenisIzinSchema';
import { CreateJenisIzinCommand } from '../../application/jenis_izin/CreateJenisIzinCommand';
import { DeleteJenisIzinCommand } from '../../application/jenis_izin/DeleteJenisIzinCommand';
import { GetJenisIzinQuery } from '../../application/jenis_izin/GetJenisIzinQuery';
import { UpdateJenisIzinCommand } from '../../application/jenis_izin/UpdateJenisIzinCommand';
import { GetAllJenisIzinQuery } from '../../application/jenis_izin/GetAllJenisIzinQuery';

@controller('/jenis_izin')
export class JenisIzinController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        if(Object.keys(req.query).length > 0){
            const page = parseInt(String(req.query?.page ?? "1"));
            const pageSize = parseInt(String(req.query?.pageSize ?? "10"));
            const startIndex = (page - 1) * pageSize;
            const endIndex = page * pageSize;

            let [data, count] = await this._queryBus.execute(
                new GetAllJenisIzinQuery(pageSize, startIndex)
            );
            data.map(d=>d.dokumen = d.dokumen? 1:0)
            
            const totalPage = Math.ceil(count / pageSize);
            const nextPage = (page + 1 > totalPage) ? null : page + 1;
            const prevPage = (page - 1 < 1) || (totalPage < page) ? null : page - 1;

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
                    linkprevPage: prevPage !== null ? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${prevPage}`) : null,
                    currentPage: page,
                    linkCurrentPage: req.protocol + "://" + req.get('host') + req.originalUrl,
                    nextPage: nextPage,
                    linkNextPage: nextPage !== null ? req.protocol + "://" + req.get('host') + req.originalUrl.replace(/page=\d+/, `page=${nextPage}`) : null,
                    data: data
                },
                validation: [],
                log: [],
            });
        } else{
            const list = await this._queryBus.execute(
                new GetAllJenisIzinQuery()
            );
    
            res.status(200).json({
                status: 200,
                message: null,
                data: null,
                list: list,
                validation: [],
                log: [],
            });
        }
    }

    @httpGet('/:id')
    async detail(@request() req: Request, @response() res: Response) {
        let jenisIzin = await this._queryBus.execute(
            new GetJenisIzinQuery(parseInt(req.params.id))
        );
        jenisIzin.dokumen = jenisIzin.dokumen? 1:0

        res.status(200).json({
            status: 200,
            message: null,
            data: jenisIzin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        await jenisIzinCreateSchema.validate(req.body, { abortEarly: false })

        const jenis_izin = await this._commandBus.send(
            new CreateJenisIzinCommand(
                req.body.nama,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil menambahkan jenis izin",
            data: jenis_izin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        await jenisIzinUpdateSchema.validate(req.body, { abortEarly: false })
        const jenisIzin = await this._commandBus.send(
            new UpdateJenisIzinCommand(
                parseInt(req.body.id),
                req.body.nama,
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data jenis izin",
            data: jenisIzin,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataJenisIzin = await this._queryBus.execute(
            new GetJenisIzinQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteJenisIzinCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus jenis izin",
            data: dataJenisIzin,
            list: null,
            validation: [],
            log: [],
        });
    }
}