// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Space,
//   Input,
//   Tag,
//   Avatar,
//   Tooltip,
//   Breadcrumb,
//   theme as antdTheme,
// } from "antd";
// import {
//   PlusOutlined,
//   SearchOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   HomeOutlined,
// } from "@ant-design/icons";
// import { useNavigate, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";
// import type { RootState } from "../../../app/store";
// import { fetchUsers } from "../userSlice";

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
//   status: string;
// }

// const { Search } = Input;

// const UserList = () => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchText, setSearchText] = useState("");

//   const {
//     token: { colorBgContainer, colorTextBase },
//   } = antdTheme.useToken();

//   const { users, loading } = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const filteredUsers = users.filter((user) =>
//     user.username?.toLowerCase().includes(searchText?.toLowerCase() || "")
//   );

//   const handleDelete = (id: number) => {
//     dispatch(deleteUser(id));
//   };

//   const columns = [
//     {
//       title: t("userList.columns.username"),
//       dataIndex: "name",
//       key: "name",
//       render: (_: any, record: User) => (
//         <div className="flex items-center gap-2">
//           <Avatar style={{ backgroundColor: "#87d068" }}>
//             {record.username.charAt(0).toUpperCase()}
//           </Avatar>
//           <div>
//             <div style={{ color: colorTextBase }}>{record.username}</div>
//             <div className="text-xs text-gray-500">{record.email}</div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       title: t("userList.columns.role"),
//       dataIndex: "role",
//       key: "role",
//       render: (role: string) => {
//         const color =
//           role === "Admin" ? "geekblue" : role === "Manager" ? "gold" : "green";
//         return <Tag color={color}>{role}</Tag>;
//       },
//     },
//     {
//       title: t("userList.columns.status"),
//       dataIndex: "status",
//       key: "status",
//       render: (status: string) => (
//         <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
//       ),
//     },
//     {
//       title: t("userList.columns.actions"),
//       key: "actions",
//       render: (_: any, record: User) => (
//         <Space>
//           <Tooltip title={t("common.edit")}>
//             <Button
//               icon={<EditOutlined />}
//               shape="circle"
//               onClick={() => navigate(`/users/${record.id}/edit`)}
//             />
//           </Tooltip>
//           <Tooltip title={t("common.delete")}>
//             <Button
//               icon={<DeleteOutlined />}
//               shape="circle"
//               danger
//               onClick={() => handleDelete(record.id)}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div
//       className="p-4"
//       style={{ background: colorBgContainer, color: colorTextBase }}
//     >
//       <Breadcrumb
//         className="mb-4"
//         items={[
//           { title: <HomeOutlined />, href: "/" },
//           { title: <Link to="/users">{t("userList.breadcrumb")}</Link> },
//         ]}
//       />

//       <div className="mb-6 mt-3 flex flex-col sm:flex-row justify-between items-center gap-4">
//         <Search
//           placeholder={t("userList.search.placeholder")}
//           allowClear
//           enterButton={<SearchOutlined />}
//           onSearch={(value) => setSearchText(value)}
//           onChange={(e) => setSearchText(e.target.value)}
//           className="w-full sm:w-72"
//         />
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => navigate("/users/new")}
//           className="w-full sm:w-auto"
//         >
//           {t("userList.addButton")}
//         </Button>
//       </div>

//       <Table
//         rowKey="id"
//         columns={columns}
//         dataSource={filteredUsers}
//         pagination={{ pageSize: 5 }}
//         loading={loading}
//         scroll={{ x: true }}
//         className="rounded-md"
//       />
//     </div>
//   );
// };

// export default UserList;
