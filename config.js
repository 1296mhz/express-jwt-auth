module.exports = {
    'adapter': 'mongoose', // choose mongoose or node-json-db
    'secret': 'ilovenodejs',
    'database': 'mongodb://localhost:27017/' + this.jwtauth,
    'databaseName': 'jwtauth'
};