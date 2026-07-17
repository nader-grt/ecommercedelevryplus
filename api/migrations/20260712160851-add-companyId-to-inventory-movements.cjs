'use strict';

module.exports = {

async up(queryInterface, Sequelize){


await queryInterface.addColumn(
'InventoryMovements',
'companyId',
{
 type: Sequelize.INTEGER,
 allowNull:true
}
);



await queryInterface.sequelize.query(`

UPDATE InventoryMovements im

JOIN Inventories i

ON im.inventoryId = i.id

SET im.companyId = i.companyId;

`);




await queryInterface.changeColumn(
'InventoryMovements',
'companyId',
{
 type: Sequelize.INTEGER,
 allowNull:false
}
);




await queryInterface.addConstraint(
'InventoryMovements',
{
 fields:['companyId'],

 type:'foreign key',

 name:'fk_inventory_movements_company',

 references:{
  table:'Companies',
  field:'id'
 },

 onUpdate:'CASCADE',

 onDelete:'RESTRICT'

}
);



},



async down(queryInterface){


await queryInterface.removeConstraint(
'InventoryMovements',
'fk_inventory_movements_company'
);


await queryInterface.removeColumn(
'InventoryMovements',
'companyId'
);


}


};