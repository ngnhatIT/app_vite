import { useState } from "react";
import { Table, Button, Space, Input, Avatar, Tooltip, Pagination } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  avatarUrl?: string;
}

const { Search } = Input;

const mockUsers: User[] = [
  {
    id: 1,
    username: "Nur Aisyah Binti Zainuddin",
    email: "nuraisyahbintizainuddin@gmail.com",
    role: "Admin",
    status: "Inactive",
  },
  {
    id: 2,
    username: "Ethan Lim Wei Jie",
    email: "ethanlimweijie@gmail.com",
    role: "WSP Owner",
    status: "Inactive",
  },
  {
    id: 3,
    username: "Chloe Tan Hui Min",
    email: "chloetanhuimin@gmail.com",
    role: "Member",
    status: "Active",
  },
  // thêm dữ liệu nếu cần
];

const UserList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const isDark = useSelector((state: RootState) => state.theme.darkMode);

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        {/* Tiêu đề trái */}
        <h2 className="text-xl font-semibold text-white">User Listing</h2>

        {/* Search + Button xếp hàng ngang bên phải */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by Username"
            allowClear
            prefix={
              <SearchOutlined
                className={`mr-1 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              />
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`w-[240px] text-sm px-3 py-[6px] rounded-md border ${
              isDark
                ? "bg-[#1c1c1c] text-white border-[#3a3a3a] placeholder:text-gray-400"
                : "bg-white text-black border-gray-300 placeholder:text-gray-500"
            }`}
          />

          <Button
            icon={<PlusOutlined />}
            onClick={() => navigate("/users/new")}
            className={`h-[36px] px-4 rounded-md border text-sm font-normal flex items-center justify-center ${
              isDark
                ? "bg-[#1c1c1c] text-white border-gray-500 hover:!border-white"
                : "bg-white text-black border-gray-300 hover:!border-black"
            }`}
          >
            Add New User
          </Button>
        </div>
      </div>

      <Table
        dataSource={paginatedUsers}
        rowKey="id"
        pagination={false}
        rowClassName={() => "bg-transparent"}
        columns={[
          {
            title: "",
            dataIndex: "checkbox",
            width: 40,
            render: () => (
              <input type="checkbox" className="accent-purple-500" />
            ),
          },
          {
            title: "#",
            width: 50,
            render: (_: any, __: any, index: number) => (
              <span className="text-white">
                {(currentPage - 1) * pageSize + index + 1}
              </span>
            ),
          },
          {
            title: "Name",
            dataIndex: "username",
            render: (_: any, record: User) => (
              <div className="flex items-center gap-3">
                <Avatar src={record.avatarUrl} />
                <div>
                  <div className="font-medium text-white">
                    {record.username}
                  </div>
                  <div className="text-gray-400 text-sm">{record.email}</div>
                </div>
              </div>
            ),
          },
          {
            title: "Role",
            dataIndex: "role",
            render: (role: string) => (
              <span className="text-white">{role}</span>
            ),
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (status: "Active" | "Inactive") => (
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  status === "Active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {status}
              </span>
            ),
          },
          {
            title: "Action",
            render: (_: any, record: User) => (
              <Space>
                <Tooltip title="Edit">
                  <Button
                    icon={<EditOutlined />}
                    shape="circle"
                    className="bg-transparent border border-white text-white hover:!bg-white hover:!text-black"
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    shape="circle"
                    className="bg-transparent border border-red-500 text-red-500 hover:!bg-red-500 hover:!text-white"
                  />
                </Tooltip>
                <Tooltip title="Approve">
                  <Button
                    icon={<CheckOutlined />}
                    shape="circle"
                    className="bg-transparent border border-green-500 text-green-500 hover:!bg-green-500 hover:!text-white"
                  />
                </Tooltip>
              </Space>
            ),
          },
        ]}
        className="!bg-transparent 
    [&_.ant-table]:!bg-transparent 
    [&_.ant-table-container]:!bg-transparent 
    [&_.ant-table-content]:!bg-transparent 
    [&_.ant-table-thead_th]:!bg-transparent 
    [&_.ant-table-tbody_td]:!bg-transparent 
    [&_.ant-table-cell]:!text-white"
      />

      <div className="mt-6 flex items-center justify-between w-full">
        {/* Dropdown chọn số dòng hiển thị */}
        <div className="text-white text-sm">
          <select
            className="bg-transparent border border-gray-500 rounded px-2 py-[2px] text-sm text-white"
            value={pageSize}
            onChange={(e) => {
              //setPageSize(Number(e.target.value));
              setCurrentPage(1); // reset về page đầu
            }}
          >
            {[8, 16, 24].map((size) => (
              <option key={size} value={size} className="text-black">
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Pagination chính giữa */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredUsers.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          className="text-white [&_.ant-pagination-item-active]:!bg-[#9747FF] [&_.ant-pagination-item-active]:!border-none [&_.ant-pagination-item-active>a]:!text-white"
        />

        {/* Pagination arrow tuỳ chỉnh */}
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="w-8 h-8 rounded-md bg-[#1d152f] flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40"
          >
            &lt;
          </button>
          <button
            disabled={
              currentPage === Math.ceil(filteredUsers.length / pageSize)
            }
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredUsers.length / pageSize))
              )
            }
            className="w-8 h-8 rounded-md bg-[#1d152f] flex items-center justify-center text-white/70 hover:text-white disabled:opacity-40"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
