const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('jobpal', 'postgres', 'lamakhu',{

    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});

async function testConnection() {
    try{
        await sequelize.authenticate();
        console.log('DB connection successful............................')
        // Sync the model with database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized............................')
    }
    catch(error){
        console.error('Unable to connect to the database...............', error)

}    
}
testConnection()

module.exports = sequelize;