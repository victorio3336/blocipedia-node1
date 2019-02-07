'use strict';

const faker = require('faker');

let wikis = [];
for (let i = 1; i <= 20; i++) {
	wikis.push({
		title: faker.lorem.sentence(),
		body: faker.lorem.sentence(),
		private: faker.random.boolean(),
		createdAt: new Date(),
		updatedAt: new Date(),
		userId: 5
	});
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Wikis', wikis, {});
  },

  down: (queryInterface, Sequelize) => {
return queryInterface.bulkDelete('Wikis', wikis, {});
  }
};
