const checkValidInteger = (message) => (value) =>
  !isNaN(value) ? { success: true, value } : { success: false, message: message };

const listItem = {
  name: "list",
  // to_json can also be a convenient way to solve the N+1 problem with Postgresql JSON capabilities.
  // ARRAY( select to_json(...) )
  sql:
    "SELECT leads.*, to_json(opportunities.*) as opportunity FROM leads, opportunities WHERE leads.opportunity_id=opportunities.id;",
  restricted: ["Admin", "Member"],
};

const deleteItem = {
  name: "delete",
  sql: "DELETE FROM leads WHERE id=${id} RETURNING *;",
  restricted: ["Admin", "Member"],
  params: {
    id: checkValidInteger("Invalid opportunites id"),
  },
};

const updateItem = {
  name: "update",
  sql: "UPDATE leads SET ( ${names:name} ) = ( ${values:csv} ) WHERE id=${id} RETURNING *;",
  restricted: ["Admin", "Member"],
  params: {
    data: (value) => (value ? { success: true, value } : { success: false, message: "data should be a valid object" }),
  },
  beforeQuery: (query, params) =>
    Object.assign(
      {},
      params,
      { names: Object.keys(params.data) },
      { values: Object.keys(params.data).map((k) => params.data[k]) },
      { id: params.data.id }
    ),
};

const createItem = {
  name: "create",
  sql: "INSERT INTO leads ( ${names:name} ) VALUES ( ${values:csv} ) RETURNING *;",
  restricted: ["Admin", "Member"],
  params: {
    data: (value) => (value ? { success: true, value } : { success: false, message: "data should be a valid object" }),
  },
  beforeQuery: (query, params) =>
    Object.assign(
      {},
      params,
      { names: Object.keys(params.data) },
      { values: Object.keys(params.data).map((k) => params.data[k]) }
    ),
};

module.exports = { queries: [listItem, deleteItem, updateItem, createItem] };
