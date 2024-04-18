import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { GetAllJenisCutiQuery } from '../../application/jenis_cuti/GetAllJenisCutiQuery';
import { CreateJenisCutiCommand } from '../../application/jenis_cuti/CreateJenisCutiCommand';
import { GetJenisCutiQuery } from '../../application/jenis_cuti/GetJenisCutiQuery';
import { UpdateJenisCutiCommand } from '../../application/jenis_cuti/UpdateJenisCutiCommand';
import { DeleteJenisCutiCommand } from '../../application/jenis_cuti/DeleteJenisCutiCommand';
import { jenisCutiCreateSchema, jenisCutiUpdateSchema } from '../../domain/validation/jenisCutiSchema';

@controller('/jenis_cuti')
export class JenisCutiController {
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
                new GetAllJenisCutiQuery(pageSize, startIndex)
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
            let list = await this._queryBus.execute(
                new GetAllJenisCutiQuery()
            );
            list.map(d=>d.dokumen = d.dokumen? 1:0)
    
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
        let jenisCuti = await this._queryBus.execute(
            new GetJenisCutiQuery(parseInt(req.params.id))
        );
        jenisCuti.dokumen = jenisCuti.dokumen? 1:0

        res.status(200).json({
            status: 200,
            message: null,
            data: jenisCuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        await jenisCutiCreateSchema.validate(req.body, { abortEarly: false })

        const jenis_cuti = await this._commandBus.send(
            new CreateJenisCutiCommand(
                req.body.nama,
                req.body.min,
                req.body.max,
                req.body.kondisi==""||req.body.kondisi==null? {}:req.body.kondisi,
                req.body.dokumen=="1",
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil menambahkan jenis cuti",
            data: jenis_cuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        await jenisCutiUpdateSchema.validate(req.body, { abortEarly: false })
        const jenisCuti = await this._commandBus.send(
            new UpdateJenisCutiCommand(
                parseInt(req.body.id),
                req.body.nama,
                req.body.min,
                req.body.max,
                req.body.kondisi==""||req.body.kondisi==null? {}:req.body.kondisi,
                req.body.dokumen=="1",
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data jenis cuti",
            data: jenisCuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataJenisCuti = await this._queryBus.execute(
            new GetJenisCutiQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteJenisCutiCommand(parseInt(req.params.id))
        );

        res.status(200).json({
            status: 200,
            message: "berhasil hapus jenis cuti",
            data: dataJenisCuti,
            list: null,
            validation: [],
            log: [],
        });
    }
}