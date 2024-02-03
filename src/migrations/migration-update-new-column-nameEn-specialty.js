module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('specialties','nameEn', {
                type: Sequelize.STRING,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('specialties','nameEn', {
                type: Sequelize.STRING,
            })
        ])
    }
};