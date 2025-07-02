import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AppDispatch, RootState } from "../../app/store";
import SiderMenu, { menuItems } from "./SideMenu";
import PageHeader from "./HeaderMainL";
import SubMenuPanel from "./SubMenuPanel";
import { AppstoreOutlined } from "@ant-design/icons";
import "../../css/main_layout.css";
import "../../css/layout.css";
import { fetchWorkspacesThunk } from "../../features/workspace/workspceThunk";

const { Footer, Sider, Content } = Layout;

const MainLayout = () => {
  const isDark = useSelector((state: RootState) => state.theme.darkMode);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [activeGroup, setActiveGroup] = useState<string>("");
  const [submenusMap, setSubmenusMap] = useState<Record<string, any[]>>({});
  const [subMenuCollapsed, setSubMenuCollapsed] = useState(false);

  const workspaces = useSelector(
    (state: RootState) => state.workspace.list || []
  );

  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setActiveGroup(`/${path}`);
  }, [location.pathname]);

  useEffect(() => {
    if (activeGroup === "/workspace" && workspaces.length === 0) {
      dispatch(fetchWorkspacesThunk());
    }
  }, [activeGroup, dispatch, workspaces.length]);

  useEffect(() => {
    const map: Record<string, any[]> = {};

    for (const item of menuItems) {
      if (item.isGroup && item.submenus) {
        map[item.key] = item.submenus;
      }
    }

    map["/workspace"] = workspaces.map((ws: any) => ({
      key: `/workspace/${ws.id}`,
      link: `/workspace/${ws.id}`,
      icon: <AppstoreOutlined className="text-2xl" />,
      title: ws.name,
    }));

    setSubmenusMap(map);
  }, [workspaces]);

  const backgroundClass = isDark
    ? "bg-gradient-238 text-white"
    : "bg-white text-black";

  return (
    <div className={`h-screen w-screen overflow-hidden ${backgroundClass}`}>
      <Layout className="h-full w-full bg-transparent">
        <Sider width={151} className="!bg-transparent !text-white">
          <SiderMenu onSelectGroup={(groupKey) => setActiveGroup(groupKey)} />
        </Sider>

        <Layout className="flex flex-col flex-1">
          <PageHeader />

          <Content
            className="flex-1 overflow-auto p-4"
            style={{
              borderRadius: 24,
              background: isDark
                ? "linear-gradient(238deg, rgba(91,33,182,0.3) 30.62%, rgba(91,33,182,0.3) 100%)"
                : "#FFFFFFA3",
              boxShadow: "2px 2px 8px 0px #5b21b6",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="content-glass h-full w-full rounded-[24px] shadow-xl backdrop-blur-lg flex">
              {activeGroup && submenusMap[activeGroup] && (
                <div
                  className={`relative transition-all duration-300 ${
                    subMenuCollapsed
                      ? "w-[56px]"
                      : "w-1/4 min-w-[200px] max-w-[244px]"
                  } pr-4`}
                >
                  <SubMenuPanel
                    group={activeGroup}
                    submenus={submenusMap}
                    collapsed={subMenuCollapsed}
                    onToggleCollapse={() =>
                      setSubMenuCollapsed(!subMenuCollapsed)
                    }
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#9333ea] scrollbar-track-transparent scrollbar-thumb-rounded-full pr-2">
                <Outlet />
              </div>
            </div>
          </Content>

          <Footer className="text-center text-sm !bg-transparent text-[#9e9e9e]">
            Copyright © 2025. All Rights Reserved.
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default MainLayout;
