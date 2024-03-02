const roleModel = require("../models/role");

const roles = [
  { name: "Chariman", level: 1 },
  { name: "Senior Member", level: 2 },
  { name: "Member", level: 3 },
  { name: "Commissioner", level: 4 },
  { name: "Deputy Commissioner", level: 5 },
  { name: "Assistant Commissioner", level: 6 },
  { name: "SSTO", level: 7 },
];

const rolesSeeder = async () => {
  console.log("****** SEEDING ROLES *******");
  var roleBulkUp = roleModel.collection.initializeOrderedBulkOp();
  roles.forEach((role) => {
    roleBulkUp
      .find({ name: role.name })
      .upsert()
      .updateOne({
        $setOnInsert: { name: role.name, level: role.level },
      });
  });

  roleBulkUp.execute();
  console.log("****** ROLES SEEDED SUCCESFULLY *******");
};
module.exports = rolesSeeder; 
