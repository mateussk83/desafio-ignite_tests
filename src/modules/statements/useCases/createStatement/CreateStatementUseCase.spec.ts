import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

describe("Create Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to make a deposit in the statement", async () => {
    const user = await createUserUseCase.execute({
      name: "test name",
      email: "test email",
      password: "123"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "test deposit"
    })


    expect(statement).toHaveProperty("id")
  })

  it("should not be able to withdraw if the amount is greater than the statement amount", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "test name",
        email: "test email",
        password: "123"
      })

      const deposit = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 3000,
        description: "test deposit"
      })


      const withdraw = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.WITHDRAW,
        amount: 4000,
        description: "test deposit"
      })
    }).rejects.toBeInstanceOf(CreateStatementError)
  })

  it("should not be able to deposit in the statement for id user not existent", async () => {
    expect(async () => {

      const user = await createUserUseCase.execute({
        name: "test name",
      email: "test email",
      password: "123"
    })

    const statement = await createStatementUseCase.execute({
      user_id: "123132",
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "test deposit"
    })
  }).rejects.toBeInstanceOf(CreateStatementError)

  })
})
