import faker from 'faker';

export const getUserRandomObj = ()=>{
    return {
        email : faker.internet.email(),
        firstName : faker.name.firstName(),
        lastName : faker.name.lastName(),
        password : '123456',
        confirmPassword:'123456'
    }
};

export const userRegistrationData1 = {
    email : 'tester.testing@gmail.com',
    firstName : 'Name',
    lastName : 'Last',
    password : '123456',
    confirmPassword:'123456'
};