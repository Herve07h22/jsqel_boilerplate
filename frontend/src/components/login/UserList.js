import React from "react";
import { useJsqel } from "../../api/jsqel";
import { Table, Card, Popconfirm, Button } from "antd";

const UserList = () => {
  // Just to have a mode detailed examle of how to deal with a Jsqel endpoint
  const [users, refresh] = useJsqel("auth/list_users", { sendItNow: true });
  const [roles] = useJsqel("roles/list", { sendItNow: true, cached: true });
  const [deletedUser, deleteUser] = useJsqel("auth/delete_user", { sendItNow: false, callback: () => refresh() });

  const findRoleLabelById = (roleId) => {
    const foundRole = roles.results.find((role) => role.id === roleId);
    if (foundRole && foundRole.name) {
      return foundRole.name;
    }
    return "Unknown";
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role_id",
      render: (value, record) => findRoleLabelById(value),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => {
            deleteUser({ id: record.id });
          }}
        >
          <Button type="primary">Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card title="List of users" className="card" actions={[<Button onClick={(e) => refresh()}>Refresh</Button>]}>
      {users.error && <p>Error : {users.error}</p>}
      {deletedUser.error && <p>Error : {deletedUser.error}</p>}
      <Table
        loading={users.loading || deletedUser.loading}
        dataSource={users.results}
        columns={columns}
        rowKey={(r) => r.username}
      />
    </Card>
  );
};

export default UserList;
