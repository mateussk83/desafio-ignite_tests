import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferAmountUseCase } from "./TransferAmountUseCase";

class TransferAmountController {
  async execute(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { sender_id } = request.params;
    const { amount, description } = request.body;

    const transferAmountUseCase = container.resolve(TransferAmountUseCase);

    const transfer = await transferAmountUseCase.execute({
      amount,
      description,
      user_id:id,
      sender_id,
    });

    return response.status(201).json(transfer);
  }
}

export { TransferAmountController };
