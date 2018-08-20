var sql = require('mssql');
var config = require('../config/config');

module.exports = function (router) {

    processFile = function (file_path, file_id) {
        /**
         * Creates separate tables for each file and imports the data into each of the tables
         */

        new sql.ConnectionPool(config['database']).connect().then(function (pool) {
            return pool.request().query(`IF OBJECT_ID('[dbo].[File_Data` + file_id + `]', 'U') IS NOT NULL DROP TABLE [dbo].[File_Data` + file_id + `]; CREATE TABLE [dbo].[File_Data` + file_id + `]( [Id_Group] [int] NOT NULL, [Id_Requirement_Specs] [int] NULL, [TestCategory_Names] [nvarchar](max) NULL, [Parameter_Name] [nvarchar](max) NOT NULL, [Value] [nvarchar](max) NOT NULL, [Unit] [nvarchar](max) NULL, [Type] [int] NOT NULL) BULK INSERT [dbo].[File_Data` + file_id + `] FROM '` + file_path + `' WITH (FIRSTROW = 2, FIELDTERMINATOR = ',', ROWTERMINATOR = '\n');`)
                .then(function () {
                    console.log("Table created for " + file_path);
                    sql.close();
                }).catch(function (err) {
                    console.log(err);
                    sql.close();
                });
        }).catch(function (err) {
            console.log('SQL Connection not established', err);
            sql.close();
        });
    }
}
