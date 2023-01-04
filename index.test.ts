import server from "./index";
import request from 'supertest';

const postUser = {
    username: "Bobur",
    age: 23,
    hobbies: []
}

describe('Request to server', () => {
    test('should return 200 & and empty array', async () => {
        const res = await request(server).get(`/api/users`)
        expect(res.body).toMatchObject([])
    })
    test('should return 200 & user body', async () => {
        const res = await request(server).post(`/api/users`).send(...[postUser])

        expect(res.body).toMatchObject({ ...postUser, id: expect.any(String) })
    })
    test('should return 200 & valid response if request param list is empity', async () => {
        const res = await request(server).post(`/api/users`).send({
                "saSAs": "aSAsaSAsas"
            })

        expect(res.body).toMatchObject([
            "Username is required or must be string",
            "Age is required or must be number",
            "Hobbies is required"
        ])
    })

    afterEach(() => {
        server.close()
    })
})