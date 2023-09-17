"use client";

import customTheme from "@/theme/themeConfig";
import { ConfigProvider } from "antd";

export default function ThemeWrapper(props: any) {
  const { children } = props;

  return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
}
