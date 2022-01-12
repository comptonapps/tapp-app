process.env.NODE_ENV='test';
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const db = require('../db');
const DB = require('./DB');
let testUser1Data = {
    username: 'testUser1',
    password: 'foobar11',
    email: 'tu1@testing.com',
    city: 'Richmond',
    state: 'VA'
};
let testUser1;

beforeAll(async () => {
    const result = await db.query(`
        INSERT INTO users
        (username, password, email, city, state)
        VALUES
        ($1, $2, $3, $4, $5) RETURNING *`,
        Object.values(testUser1Data)
        );
    testUser1 = result.rows[0];
});


beforeEach(() => {

});

describe('getCreateStringAndVariables method', () => {
    test('it should return a dynamic variable POSTGRES string and an array of variables', () => {
        const [str, vars] = DB.getCreateStringAndVariables('users', {username: 'testuser', email: "j@c.com"});
        expect(str).toEqual('INSERT INTO users (username,email) VALUES ($1,$2) RETURNING *');
        expect(vars).toEqual(['testuser', 'j@c.com']);
    })
});

describe('DB.create method', () => {
    test('it should create and return a user', async () => {
        const newUserData = {
            username: 'testuser',
            password: 'secret',
            email: 'test@tester.com',
            city: 'Seattle',
            state: 'WA'
        }
        const user = await DB.create('users', newUserData);
        expect(user.id).toEqual(expect.any(Number));
        expect(user.username).toEqual(newUserData.username);
        expect(user.password).toEqual(expect.any(String));
        expect(user.email).toEqual(newUserData.email);
        expect(user.city).toEqual(newUserData.city);
        expect(user.state).toEqual(newUserData.state);
    });
});

describe('getUpdateStringAndVariables method', () => {
    test('it should return a dynamic string to update a record and an array of variables', () => {
        const [str, vars] = DB.getUpdateStringAndVariables('users', {username: 'newname'}, {id: 3});
        expect(str).toEqual('UPDATE users SET username=$1 WHERE id=$2 RETURNING *');
        expect(vars).toEqual(['newname', 3]);
    })
})

describe('DB.update method', () => {
    test('it should update a row in the db', async () => {
        const updatedUser = await DB.updateRecord('users', {city: 'Duluth', state: 'MN'}, {id: testUser1.id});
        expect(updatedUser.id).toEqual(testUser1.id);
        expect(updatedUser.city).toEqual('Duluth');
        expect(updatedUser.state).toEqual('MN');
    });
});

describe('DB.getDeleteStringAndVariables method', () => {
    test('it should return a dynamic string for deleting a record and an array of variables', () => {
        const [str, vars] = DB.getDeleteStringAndVariables('drinks', {id: 5});
        expect(str).toEqual('DELETE FROM drinks WHERE id=$1 RETURNING *');
        expect(vars).toEqual([5]);
    })
})

describe('DB.deleteRecord method', () => {
    test('it should delete a record from the database', async () => {
        const userID = testUser1.id;
        await DB.deleteRecord('users', {id: userID});
        const result = await db.query(`SELECT * FROM users WHERE id=$1`, [userID]);
        expect(result.rows.length).toEqual(0);
    });
})

afterAll(async () => {
    await db.query('DELETE FROM users');
    db.end();
});

