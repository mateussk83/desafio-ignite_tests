import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"


let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {
beforeEach(() => {
  inMemoryUsersRepository = new InMemoryUsersRepository()
  authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
})
  it("Should be able to Authenticate a User", async () => {
    const user = {
      name: "user test",
      email: "usertest@email.com",
      password: "123"
    }

    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    console.log(authenticatedUser)

    expect(authenticatedUser).toHaveProperty("token")
  })
  it("Should not be able to Authenticate a User with email nonexistent", async () => {
    expect( async () => {
    const user = {
      name: "user test",
      email: "usertest@email.com",
      password: "123"
    }

    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: "usertest1@email.com",
      password: user.password
    })

    console.log(authenticatedUser)


    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to Authenticate a User with password nonexistent", async () => {
    expect( async () => {
    const user = {
      name: "user test",
      email: "usertest@email.com",
      password: "123"
    }

    await createUserUseCase.execute(user)

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: "234"
    })

    console.log(authenticatedUser)


    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
