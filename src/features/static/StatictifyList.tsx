// 📁 src/features/workspace/WorkspaceList.tsx
import { useEffect, useState } from "react";
import { Table, Input, Button, Spin } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchAuditLogsThunk } from "../audit_log/auditLogThunk";

const StatictifyList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  const { list, total, status } = useSelector(
    (state: RootState) => state.statictify
  );
  const loading = status === "loading";

  useEffect(() => {
    dispatch(
      fetchAuditLogsThunk({ page: currentPage, pageSize, search: searchText })
    );
  }, [currentPage, pageSize, searchText, dispatch]);

  const columns = [
    {
      title: "",
      render: () => <input type="checkbox" className="accent-purple-500" />,
      width: 40,
    },
    {
      title: "#",
      render: (_: any, __: any, index: number) => (
        <span className="text-white">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
      width: 50,
    },
    {
      title: "Workspace",
      dataIndex: "name",
      render: (text: string) => <span className="text-white">{text}</span>,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text: string) => <span className="text-white">{text}</span>,
    },
    {
      title: "Total Google Sheet Files",
      dataIndex: "totalSheets",
      render: (num: number) => <span className="text-white">{num}</span>,
    },
    {
      title: "Total User",
      dataIndex: "totalUsers",
      render: (num: number) => <span className="text-white">{num}</span>,
    },
    {
      title: "Weekly access",
      dataIndex: "weeklyAccess",
      render: (num: number) => <span className="text-white">{num}</span>,
    },
    {
      title: "Review notes",
      dataIndex: "notes",
      render: (text: string) => (
        <span className="text-white truncate" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      render: () => (
        <Button
          icon={<EyeOutlined />}
          shape="circle"
          className="bg-transparent border border-white text-white hover:!bg-white hover:!text-black"
        />
      ),
    },
  ];

  return (
    <Spin spinning={loading} size="large">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h2 className="text-xl font-semibold text-white">WSP Listing</h2>

          <div className="flex gap-2">
            <Input
              placeholder="Search by workspace"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<SearchOutlined />}
              className="w-[300px] h-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded"
            />
            <Button
              icon={<FileExcelOutlined />}
              className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-medium h-10 px-4"
            >
              Export Excel
            </Button>
          </div>
        </div>

        <Table
          rowKey="id"
          dataSource={list}
          columns={columns}
          pagination={false}
          className="!bg-transparent [&_.ant-table-cell]:!text-white"
        />

        <div className="flex justify-between items-center mt-4 text-white">
          <span className="text-sm">
            {list.length === 0
              ? "0"
              : `${(currentPage - 1) * pageSize + 1} - ${
                  (currentPage - 1) * pageSize + list.length
                } of ${total}`}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 bg-[#1d152f] rounded text-white/70 hover:text-white disabled:opacity-40"
            >
              &lt;
            </button>
            <button
              disabled={currentPage * pageSize >= total}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(total / pageSize))
                )
              }
              className="w-8 h-8 bg-[#1d152f] rounded text-white/70 hover:text-white disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default StatictifyList;
