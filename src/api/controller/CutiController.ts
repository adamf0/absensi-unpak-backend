import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { CreateCutiCommand } from '../../application/cuti/CreateCutiCommand';
import { UpdateCutiCommand } from '../../application/cuti/UpdateCutiCommand';
import { DeleteCutiCommand } from '../../application/cuti/DeleteCutiCommand';
import { GetAllCutiQuery } from '../../application/cuti/GetAllCutiQuery';
import { GetCutiQuery } from '../../application/cuti/GetCutiQuery';
import { cutiApprovalSchema, cutiCreateSchema, cutiUpdateSchema } from '../../domain/validation/cutiSchema';
import { cutiFilePath, saveDokumenCuti } from '../../infrastructure/port/IO';
import { ApprovalCutiCommand } from '../../application/cuti/ApprovalCutiCommand';
import { StatusCuti } from '../../domain/enum/StatusCuti';
import { CountAllCutiOnWaitingQuery } from '../../application/cuti/CountAllCutiOnWaitingQuery';
import { CountAllIzinOnWaitingQuery } from '../../application/izin/CountAllIzinOnWaitingQuery';
import fs from 'fs';

@controller('/cuti')
export class CutiController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        let nidn,nip,search,page,pageSize,startIndex,endIndex
        nidn = req.query?.nidn==undefined || req.query?.nidn=="null"? null:req.query.nidn
        nip = req.query?.nip==undefined || req.query?.nip=="null"? null:req.query.nip
        search = req.query?.search==undefined || req.query?.search=="null"? null:req.query.search
        page = req.query?.page==undefined || req.query?.page=="null"? null:parseInt(String(req.query?.page ?? "1"))
        pageSize = req.query?.pageSize==undefined || req.query?.pageSize=="null"? null:parseInt(String(req.query?.pageSize ?? "10"))
        startIndex = (page - 1) * pageSize;
        endIndex = page * pageSize;

        let [data, count] = await this._queryBus.execute(
            new GetAllCutiQuery(
                pageSize, 
                startIndex, 
                ["undefined","null"].includes(nidn)? null:nidn,
                ["undefined","null"].includes(nip)? null:nip,
                ["undefined","null"].includes(search)? null:search,
            )
        );
        data.map((d)=>{
            d.dokumen = d.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/cuti/${d.dokumen}`
        })
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
    }

    @httpGet('/:id')
    async detail(@request() req: Request, @response() res: Response) {
        let cuti = await this._queryBus.execute(
            new GetCutiQuery(parseInt(req.params.id))
        );
        cuti.dokumen = cuti.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/cuti/${cuti.dokumen}`

        res.status(200).json({
            status: 200,
            message: null,
            data: cuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        const uploadResult = await saveDokumenCuti(req, res);
        const [_, countCuti] = await this._queryBus.execute(
            new CountAllCutiOnWaitingQuery(req?.body?.nidn,req?.body?.nip)
        );
        const [__, countIzin] = await this._queryBus.execute(
            new CountAllIzinOnWaitingQuery(req?.body?.nidn,req?.body?.nip)
        );
        if(countCuti || countIzin){
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${cutiFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw new Error(`pengajuan izin ditolak karena masih ada ${countCuti? "cuti":"izin"} yg belum di terima`)
        }

        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;
        await cutiCreateSchema.validate(req.body, { abortEarly: false }).catch((error:Error) => {
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${cutiFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw error
        });

        const cuti = await this._commandBus.send(
            new CreateCutiCommand(
                req.body.nidn,
                req.body.nip,
                req.body.tanggal_mulai,
                req.body.tanggal_akhir,
                req.body.lama_cuti,
                req.body.tujuan,
                req.body.jenis_cuti,
                uploadResult?.file?.filename
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
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        const uploadResult = await saveDokumenCuti(req, res);
        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;
        await cutiUpdateSchema.validate(req.body, { abortEarly: false }).catch((error:Error) => {
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${cutiFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw error
        });

        const cuti = await this._commandBus.send(
            new UpdateCutiCommand(
                parseInt(req.body.id),
                req.body.nidn,
                req.body.nip,
                req.body.tanggal_mulai,
                req.body.tanggal_akhir,
                req.body.lama_cuti,
                req.body.tujuan,
                req.body.jenis_cuti,
                uploadResult?.file?.filename
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
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataCuti = await this._queryBus.execute(
            new GetCutiQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteCutiCommand(parseInt(req.params.id))
        );
        if(dataCuti?.dokumen!==null){ //belum di tes lagi
            fs.unlink(`${cutiFilePath}/${dataCuti?.dokumen}`, (err) => {})
        }

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengajuan cuti",
            data: dataCuti,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/approval')
    async approval(@request() req: Request, @response() res: Response) {
        await cutiApprovalSchema.validate(req.body, { abortEarly: false });
        const cuti = await this._commandBus.send(
            new ApprovalCutiCommand(
                parseInt(req.body.id),
                req.body.type as StatusCuti,
                req.body.note,
            )
        );

        res.status(200).json({
            status: 200,
            message: `berhasil ${req.body.type} cuti`,
            data: cuti,
            list: null,
            validation: [],
            log: [],
        });
    }
}