// import React, { useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Space,
//   Avatar,
//   Tooltip,
//   List,
//   Typography,
//   message,
//   Popconfirm,
//   theme as antdTheme,
// } from "antd";
// import {
//   UsergroupAddOutlined,
//   LockOutlined,
//   EyeOutlined,
//   DeleteOutlined,
//   EditOutlined,
// } from "@ant-design/icons";

// import WorkspaceAddUser from "./WorkspaceAddUser";
// import WorkspaceChangePassword from "./WorkspaceChangePassword";
// import { useFakeApi } from "../../../hooks/useFakeApi";
// import PageHeader from "../../../layouts/PageHeader";

// const { Text } = Typography;

// interface Workspace {
//   id: number;
//   name: string;
//   owner: string;
//   users: number[];
// }

// interface User {
//   id: number;
//   username: string;
//   email: string;
// }

// const WorkspaceList: React.FC = () => {
//   const {
//     token: { colorBgContainer, colorTextBase },
//   } = antdTheme.useToken();

//   const { data: workspaces } = useFakeApi<Workspace>("workspaces");
//   const { data: users } = useFakeApi<User>("users");

//   const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
//     null
//   );
//   const [modalType, setModalType] = useState<
//     "addUser" | "changePassword" | "viewUsers" | null
//   >(null);

//   const openModal = (workspace: Workspace, type: typeof modalType) => {
//     setSelectedWorkspace(workspace);
//     setModalType(type);
//   };

//   const closeModal = () => {
//     setModalType(null);
//   };

//   const afterClose = () => {
//     setSelectedWorkspace(null);
//   };

//   const handleRemoveUser = (userId: number) => {
//     if (!selectedWorkspace) return;
//     const updatedUsers = selectedWorkspace.users.filter((id) => id !== userId);
//     const updatedWorkspace = { ...selectedWorkspace, users: updatedUsers };
//     message.success("Đã xoá người dùng khỏi workspace");
//     setSelectedWorkspace(updatedWorkspace);
//   };

//   const renderUserAvatars = (workspace: Workspace) => {
//     const userObjects = workspace.users
//       .map((id) => users.find((u: any) => String(u.id) === String(id)))
//       .filter(Boolean) as User[];

//     const maxDisplay = 4;
//     const visible =
//       userObjects.length > maxDisplay ? userObjects.slice(0, 3) : userObjects;
//     const extra = userObjects.length > maxDisplay ? userObjects.length - 3 : 0;

//     return (
//       <Space size="small">
//         {visible.map((user) => (
//           <Tooltip title={user.username} key={user.id}>
//             <Avatar style={{ backgroundColor: "#87d068" }}>
//               {user.username.charAt(0).toUpperCase()}
//             </Avatar>
//           </Tooltip>
//         ))}
//         {extra > 0 && <Avatar>+{extra}</Avatar>}
//         <Tooltip title="Xem tất cả người dùng">
//           <Button
//             type="text"
//             shape="circle"
//             icon={<EyeOutlined />}
//             onClick={() => openModal(workspace, "viewUsers")}
//           />
//         </Tooltip>
//       </Space>
//     );
//   };

//   const columns = [
//     {
//       title: "Tên Workspace",
//       dataIndex: "name",
//     },
//     {
//       title: "Chủ sở hữu",
//       dataIndex: "owner",
//     },
//     {
//       title: "Người dùng",
//       key: "users",
//       render: (_: any, record: Workspace) => renderUserAvatars(record),
//     },
//     {
//       title: "Hành động",
//       render: (_: any, record: Workspace) => (
//         <Space>
//           <Tooltip title="Thêm người dùng">
//             <Button
//               icon={<UsergroupAddOutlined />}
//               onClick={() => openModal(record, "addUser")}
//             />
//           </Tooltip>
//           <Tooltip title="Đổi mật khẩu">
//             <Button
//               icon={<LockOutlined />}
//               onClick={() => openModal(record, "changePassword")}
//             />
//           </Tooltip>
//           <Tooltip title="Thay đổi thông tin">
//             <Button
//               icon={<EditOutlined />}
//               onClick={() => openModal(record, "addUser")}
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
//       {/* Header với breadcrumb và nút tạo mới */}
//       <PageHeader
//         breadcrumbPaths={[{ label: "Quản lý Workspace" }]}
//         searchPlaceholder="Tìm kiếm workspace"
//         onSearch={(text: any) => {
//           // nếu muốn lọc workspace theo tên
//           console.log("search", text);
//         }}
//         addButtonVisible={true}
//         addButtonLabel="Tạo Workspace mới"
//         addButtonAction={() => {
//           message.info("Chức năng tạo workspace mới sẽ sớm được triển khai.");
//         }}
//       />

//       <Table
//         rowKey="id"
//         columns={columns}
//         dataSource={workspaces}
//         pagination={{ pageSize: 5 }}
//         bordered
//         className="rounded-md"
//         scroll={{ x: true }}
//       />

//       {/* Modal Thêm người dùng */}
//       <Modal
//         title="Thêm người dùng"
//         open={modalType === "addUser"}
//         onCancel={closeModal}
//         afterClose={afterClose}
//         footer={null}
//         destroyOnClose
//         centered
//       >
//         {modalType === "addUser" && selectedWorkspace && (
//           <WorkspaceAddUser
//             workspace={selectedWorkspace}
//             onClose={closeModal}
//           />
//         )}
//       </Modal>

//       {/* Modal Đổi mật khẩu */}
//       <Modal
//         title="Đổi mật khẩu Workspace"
//         open={modalType === "changePassword"}
//         onCancel={closeModal}
//         afterClose={afterClose}
//         footer={null}
//         destroyOnClose
//         centered
//       >
//         {modalType === "changePassword" && selectedWorkspace && (
//           <WorkspaceChangePassword
//             workspace={selectedWorkspace}
//             onClose={closeModal}
//           />
//         )}
//       </Modal>

//       {/* Modal xem danh sách người dùng */}
//       <Modal
//         title="Danh sách người dùng"
//         open={modalType === "viewUsers"}
//         onCancel={closeModal}
//         afterClose={afterClose}
//         footer={null}
//         destroyOnClose
//         centered
//       >
//         {modalType === "viewUsers" && selectedWorkspace && (
//           <List
//             dataSource={
//               selectedWorkspace.users
//                 .map((id) => users.find((u: any) => u.id === id))
//                 .filter(Boolean) as User[]
//             }
//             renderItem={(user) => (
//               <List.Item
//                 key={user.id}
//                 actions={[
//                   <Popconfirm
//                     title="Xoá người dùng khỏi workspace?"
//                     onConfirm={() => handleRemoveUser(user.id)}
//                     okText="Xoá"
//                     cancelText="Huỷ"
//                   >
//                     <Button icon={<DeleteOutlined />} danger />
//                   </Popconfirm>,
//                 ]}
//               >
//                 <List.Item.Meta
//                   avatar={
//                     <Avatar style={{ backgroundColor: "#1890ff" }}>
//                       {user.username.charAt(0).toUpperCase()}
//                     </Avatar>
//                   }
//                   title={<Text>{user.username}</Text>}
//                   description={user.email}
//                 />
//               </List.Item>
//             )}
//           />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default WorkspaceList;
