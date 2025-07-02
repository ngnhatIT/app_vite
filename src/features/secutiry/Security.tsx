// 📁 src/features/security/SecurityIncidentsList.tsx
import { useEffect, useState } from "react";
import { Table, Input, Select, Button, DatePicker, Spin } from "antd";
import {
  SearchOutlined,
  FileExcelOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncidentsThunk } from "./securityThunk";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { AppDispatch, RootState } from "../../app/store";

const { RangePicker } = DatePicker;

const SecurityIncidentsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [user, setUser] = useState("");
  const [violation, setViolation] = useState("");
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const { list, total, status } = useSelector(
    (state: RootState) => state.incident
  );
  const loading = status === "loading";

  useEffect(() => {
    dispatch(
      fetchIncidentsThunk({
        page: currentPage,
        pageSize,
        user,
        violation,
        fromDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        toDate: dateRange?.[1]?.format("YYYY-MM-DD"),
      })
    );
  }, [currentPage, pageSize, user, violation, dateRange, dispatch]);

  const columns = [
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
      title: t("incident.columns.user"),
      dataIndex: "user",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <img
            src={record.avatar}
            alt={record.user}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-white">
            <div>{record.user}</div>
            <div className="text-white/60 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: t("incident.columns.violation"),
      dataIndex: "violation",
      render: (text: string) => <span className="text-white">{text}</span>,
    },
    {
      title: t("incident.columns.time"),
      dataIndex: "time",
      render: (text: string) => (
        <span className="text-white">
          {dayjs(text).format("DD-MM-YYYY, HH:mm")}
        </span>
      ),
    },
    {
      title: t("incident.columns.notes"),
      dataIndex: "notes",
      render: (text: string) => (
        <span className="text-white truncate" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: t("incident.columns.action"),
      render: () => <span className="text-white">...</span>,
    },
  ];

  return (
    <Spin spinning={loading} size="large">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-4">
          {t("incident.title")}
        </h2>

        <div className="flex flex-wrap gap-3 mb-4">
          <Input
            placeholder={t("incident.filters.user")}
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-[200px] text-white bg-white/10 border-white/20"
          />
          <Select
            value={violation}
            onChange={setViolation}
            placeholder={t("incident.filters.violation")}
            allowClear
            className="w-[200px]"
            options={["Multiple_downloads", "Failed_login"].map((v) => ({
              label: v,
              value: v,
            }))}
          />
          <RangePicker
            format="YYYY-MM-DD"
            onChange={(range) => setDateRange(range)}
            className="text-white"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setUser("");
              setViolation("");
              setDateRange(null);
            }}
          >
            {t("incident.clear")}
          </Button>
          <Button icon={<SearchOutlined />} type="primary">
            {t("incident.search")}
          </Button>
          <Button
            icon={<FileExcelOutlined />}
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
          >
            {t("incident.export")}
          </Button>
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

export default SecurityIncidentsList;
