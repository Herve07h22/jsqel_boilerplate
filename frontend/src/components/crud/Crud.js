import React, { useState } from "react";
import { useJsqel } from "../../api/jsqel";
import { Table, Card, Popconfirm, Button, message } from "antd";
import CreateEdit from "./CreateEdit";
import ExportCSV from "./ExportCSV";

/* ******************************************************
 *
 * Crud Component
 *
 * Render a cards with built-in CRUD features
 * props :
 * - api        : string | Main base endpoint. Endpoints list new update and delete should be defined
 * - ressource  : string | Table name
 * - exportCSV  : string | if not empty, add a CSV export button with this label
 * - filter     : object | object injected in the parameters of the query
 * - title      : string | title of the card
 * - fields     : array of objects | fields displayed in the form. Should be like that :
 *   {   name:"<name of the field that shoul match the database name>" ,
 *       label:"<Explicit name for user>" ,
 *       position : "primary" or "secondary". If primary, appears a a column in the list. Else, appears in dropdown
 *       type : "integer", "string", [{id:1, "choice1"}, {id:2, value:"choice2"}], {ressource:"xxxx", field:"<name of the field>"}
 *       validation : array of objects. { rule:value=>boolean (true if OK), message:"Message if validation fails" }
 *    }
 *
 * ******************************************************/

const Crud = ({ api, ressource, exportCSV = "", filter = {}, title = "Title of this form", fields = [] }) => {
  const [listItem, refreshListItem] = useJsqel(`${api}/list`, { sendItNow: true, table: ressource, ...filter });
  const userFeedback = (feedbackMessage) => ({ error }) => {
    if (error) {
      console.log(error.message);
      message.error(error.message);
    } else {
      message.success(feedbackMessage);
      setCurrentItem(null);
      refreshListItem();
    }
  };
  const [deletedItem, deleteItem] = useJsqel(`${api}/delete`, {
    sendItNow: false,
    table: ressource,
    callback: userFeedback("Suppression réussie"),
  });
  const [createdItem, createItem] = useJsqel(`${api}/create`, {
    sendItNow: false,
    table: ressource,
    callback: userFeedback("Création réussie"),
  });
  const [updatedItem, updateItem] = useJsqel(`${api}/update`, {
    sendItNow: false,
    table: ressource,
    callback: userFeedback("Mise à jour réussie"),
  });
  const saveItem = (item) => {
    if (item) {
      item.id ? updateItem({ data: item }) : createItem({ data: item });
    } else {
      setCurrentItem(null);
    }
  };

  const [currentItem, setCurrentItem] = useState(null);

  const columnsList = fields
    .filter((field) => field.position === "primary")
    .map((field) => ({
      title: field.label,
      dataIndex: field.name,
      render: field.type === "date" ? (text, record) => new Date(record[field.name]).toLocaleDateString() : null,
    }));
  const columnsListAndActions = [
    ...columnsList,
    {
      title: "Edit",
      render: (text, record) => (
        <Button type="primary" onClick={() => setCurrentItem(record)}>
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => {
            deleteItem({ id: record.id });
          }}
        >
          <Button type="primary">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const loading = listItem.loading || deletedItem.loading;

  if (currentItem !== null)
    return (
      <Card title={title + (currentItem.id ? ` : edit #${currentItem.id}` : " : create")}>
        <CreateEdit
          onSave={saveItem}
          fields={fields}
          currentItem={currentItem}
          api={api}
          loading={createdItem.loading || updatedItem.loading}
        />
      </Card>
    );

  return (
    <Card
      title={title}
      extra={
        <Button type="primary" onClick={(e) => setCurrentItem({})}>
          New item
        </Button>
      }
      actions={[
        exportCSV && (
          <ExportCSV dataSource={listItem.results} columns={columnsListAndActions}>
            {exportCSV}
          </ExportCSV>
        ),
      ]}
    >
      {listItem.error && <p>Error : {listItem.error}</p>}
      {deletedItem.error && <p>Error : {deletedItem.error}</p>}
      <Table loading={loading} dataSource={listItem.results} columns={columnsListAndActions} rowKey={(r) => r.id} />
    </Card>
  );
};

const choice = ({ id, value }) => ({ id, value });

export { Crud, choice };
