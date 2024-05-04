import { injectable } from 'inversify';
import { ICommandHandler } from '../../infrastructure/abstractions/messaging/ICommandHandler';
import { DeleteClaimAbsenCommand } from './DeleteClaimAbsenCommand';
import { getConnection } from 'typeorm';
import { ClaimAbsen } from '../../infrastructure/orm/ClaimAbsen';

@injectable()
export class DeleteClaimAbsenCommandHandler implements ICommandHandler<DeleteClaimAbsenCommand> {
  commandToHandle: string = DeleteClaimAbsenCommand.name;
  // _db: DataSource;

  constructor(
    // @inject(TYPES.DB) private readonly _db: DataSource
  ) {
    // this._db = AppDataSource.initialize();
  }

  async handle(command: DeleteClaimAbsenCommand) {
    const _db = await getConnection("default");
    await _db.getRepository(ClaimAbsen).delete(command.id)

    // const application: Application = new Application(
    //   command.guid,
    //   command.jobId,
    //   command.firstname,
    //   command.lastname,
    //   command.email,
    //   command.currentPosition
    // ); es
  }
}