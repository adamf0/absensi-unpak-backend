import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { TYPES } from '../../infrastructure/types';
import { ICommandBus } from '../../infrastructure/abstractions/messaging/ICommandBus';
import { IQueryBus } from '../../infrastructure/abstractions/messaging/IQueryBus';
import { ILog } from '../../infrastructure/abstractions/messaging/ILog';
import { claimAbsenApprovalSchema, claimAbsenCreateSchema, claimAbsenUpdateSchema } from '../../domain/validation/claimAbsenSchema';
import { claimAbsenFilePath, saveDokumenClaimAbsen } from '../../infrastructure/port/IO';
import { StatusClaimAbsen } from '../../domain/enum/StatusClaimAbsen';
import fs from 'fs';
import { UpdateClaimAbsenCommand } from '../../application/claimAbsen/UpdateClaimAbsenCommand';
import { GetClaimAbsenQuery } from '../../application/claimAbsen/GetClaimAbsenQuery';
import { DeleteClaimAbsenCommand } from '../../application/claimAbsen/DeleteClaimAbsenCommand';
import { ApprovalClaimAbsenCommand } from '../../application/claimAbsen/ApprovalClaimAbsenCommand';
import { GetAllClaimAbsenQuery } from '../../application/claimAbsen/GetAllClaimAbsenQuery';
import { CreateClaimAbsenCommand } from '../../application/claimAbsen/CreateClaimAbsenCommand';
import { CheckAbsenIdQuery } from '../../application/claimAbsen/CheckAbsenIdQuery';

@controller('/claim_absen')
export class ClaimAbsenController {
    constructor(
        @inject(TYPES.Log) private readonly _log: ILog,
        @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
        @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
    ) { }

    @httpGet('/')
    async index(@request() req: Request, @response() res: Response) {
        let nidn,nip,page,pageSize,startIndex,endIndex
        nidn = req.query?.nidn==undefined || req.query?.nidn=="null"? null:req.query.nidn
        nip = req.query?.nip==undefined || req.query?.nip=="null"? null:req.query.nip
        page = req.query?.page==undefined || req.query?.page=="null"? null:parseInt(String(req.query?.page ?? "1"))
        pageSize = req.query?.pageSize==undefined || req.query?.pageSize=="null"? null:parseInt(String(req.query?.pageSize ?? "10"))
        startIndex = (page - 1) * pageSize;
        endIndex = page * pageSize;

        let [data, count] = await this._queryBus.execute(
            new GetAllClaimAbsenQuery(
                pageSize, 
                startIndex, 
                ["undefined","null"].includes(nidn)? null:nidn,
                ["undefined","null"].includes(nip)? null:nip,
            )
        );
        data.map((d)=>{
            d.dokumen = d.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/claimAbsen/${d.dokumen}`
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
        let claimAbsen = await this._queryBus.execute(
            new GetClaimAbsenQuery(parseInt(req.params.id))
        );
        claimAbsen.dokumen = claimAbsen.dokumen==null? null:`${req.protocol}://${req.headers.host}/static/claimAbsen/${claimAbsen.dokumen}`

        res.status(200).json({
            status: 200,
            message: null,
            data: claimAbsen,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/create')
    async store(@request() req: Request, @response() res: Response) {
        const uploadResult = await saveDokumenClaimAbsen(req, res);
        
        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;
        await claimAbsenCreateSchema.validate(req.body, { abortEarly: false }).catch((error:Error) => {
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${claimAbsenFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw error
        });

        const [_, isFoundClaimAbsen] = await this._queryBus.execute(
            new CheckAbsenIdQuery(req.body.absenId)
        );
        if(isFoundClaimAbsen){
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${claimAbsenFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw new Error(`pengajuan claim absen ditolak karena data sudah ada sebelumnya`)
        }

        const claimAbsen = await this._commandBus.send(
            new CreateClaimAbsenCommand(
                req.body.absenId,
                req.body.catatan,
                uploadResult?.file?.filename
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil mengajukan claimAbsen",
            data: claimAbsen,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/update')
    async update(@request() req: Request, @response() res: Response) {
        const uploadResult = await saveDokumenClaimAbsen(req, res);
        // const uploadedFile: UploadedFile = uploadResult.file;
        // const { body } = uploadResult;
        await claimAbsenUpdateSchema.validate(req.body, { abortEarly: false }).catch((error:Error) => {
            if(uploadResult?.file?.filename!==null){
                fs.unlink(`${claimAbsenFilePath}/${uploadResult?.file?.filename}`, (err) => {})
            }
            throw error
        });

        const claimAbsen = await this._commandBus.send(
            new UpdateClaimAbsenCommand(
                parseInt(req.body.id),
                req.body.absenId,
                req.body.catatan,
                uploadResult?.file?.filename
            )
        );

        res.status(200).json({
            status: 200,
            message: "berhasil update data claimAbsen",
            data: claimAbsen,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpGet('/delete/:id')
    async delete(@request() req: Request, @response() res: Response) {
        const dataClaimAbsen = await this._queryBus.execute(
            new GetClaimAbsenQuery(parseInt(req.params.id))
        );
        await this._commandBus.send(
            new DeleteClaimAbsenCommand(parseInt(req.params.id))
        );
        if(dataClaimAbsen?.dokumen!==null){ //belum di tes lagi
            fs.unlink(`${claimAbsenFilePath}/${dataClaimAbsen?.dokumen}`, (err) => {})
        }

        res.status(200).json({
            status: 200,
            message: "berhasil hapus pengajuan claimAbsen",
            data: dataClaimAbsen,
            list: null,
            validation: [],
            log: [],
        });
    }

    @httpPost('/approval')
    async approval(@request() req: Request, @response() res: Response) {
        await claimAbsenApprovalSchema.validate(req.body, { abortEarly: false });
        const claimAbsen = await this._commandBus.send(
            new ApprovalClaimAbsenCommand(
                parseInt(req.body.id),
                req.body.type as StatusClaimAbsen,
            )
        );

        res.status(200).json({
            status: 200,
            message: `berhasil ${req.body.type} claimAbsen`,
            data: claimAbsen,
            list: null,
            validation: [],
            log: [],
        });
    }
}