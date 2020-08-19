// Really simple exemple of API

const list = {
  name: "list",
  sql: "SELECT * FROM Roles;",
  restricted: ["Admin"],
};

module.exports = { queries: [list] };
