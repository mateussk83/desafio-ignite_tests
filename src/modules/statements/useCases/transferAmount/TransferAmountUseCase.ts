import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferAmountError } from "./TransferAmountError";

interface IRequest {
  id: string;
  sender_id: string;
  amount: number,
  description: string
}



@injectable()
export class TransferAmountUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ id ,sender_id, amount, description }: IRequest): Promise<Statement> {

    const recipientUser = await this.usersRepository.findById(id);


    if(!recipientUser) {
      throw new TransferAmountError.UserNotFound();
    }

    const BalanceAccount = await this.statementsRepository.getUserBalance({
      user_id: id
    })

    if(BalanceAccount.balance < amount) {
      throw new TransferAmountError.insufficientFundsError()
    }

    const transfer = await this.statementsRepository.create({
      amount,
      description,
      type: OperationType.TRANSFER,
      sender_user_id: sender_id,
      user_id: id
    })

    return transfer
  }
}
