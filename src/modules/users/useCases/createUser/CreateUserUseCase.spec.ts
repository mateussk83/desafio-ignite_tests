import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to Create a new User", async () => {
    const user = {
      name: "user test",
      email: "usertest@email.com",
      password: "123"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email)


    expect(userCreated).toHaveProperty("id")
  })

  it("Should not be able to Create a new User with email exists", async () => {
    expect(async () => {

      const user1 = {
        name: "user test1",
        email: "usertest@email.com",
        password: "123"
      }

      const user2 = {
        name: "user test2",
        email: "usertest@email.com",
        password: "345"
      }

      await createUserUseCase.execute({
        name: user1.name,
        email: user1.email,
        password: user1.password
      })

      await createUserUseCase.execute({
        name: user2.name,
        email: user2.email,
        password: user2.password
      })
    }).rejects.toBeInstanceOf(CreateUserError)

  })

})
