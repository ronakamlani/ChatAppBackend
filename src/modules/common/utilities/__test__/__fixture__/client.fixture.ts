import faker from 'faker';

//pass : 123456
export const clientData = {
    name : "Test Client",
    isTrusted : true,
};

export const clientRand = ()=>{
    return ({
        name : faker.name.firstName(),
        isTrusted : true,
    });
}