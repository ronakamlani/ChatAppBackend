import faker from 'faker';

//pass : 123456
export const userPassword = "123456";
export const userFakePassword = "456123";
export const user1 = {
    "email" : "test@example.com",
    "password" : "$2b$10$BCfvOAwiXsod/mOt9McdzO3qOK.ta533MVS.0csgDnqQ6XaApwFVO",
    "firstName" : "Test",
    "lastName" : "Test",
    "roles" : ["USER"],
};

export const userRand = ()=>{
    return ({
        "email" : faker.internet.email(),
        "password" : "$2b$10$BCfvOAwiXsod/mOt9McdzO3qOK.ta533MVS.0csgDnqQ6XaApwFVO",
        "firstName" : faker.name.firstName(),
        "lastName" : faker.name.lastName(),
        "roles" : ["USER"],
    });
}