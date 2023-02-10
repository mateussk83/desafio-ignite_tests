import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferAmountError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class UserSenderNotFound extends AppError {
    constructor() {
      super('User Sender not found', 404);
    }
  }

  export class insufficientFundsError extends AppError {
    constructor() {
      super('amount greater than the account balance', 401);
    }
  }
}
