"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "./AppHeader";
import { MobileNav } from "./MobileNav";
import { dashboardTabs, Sidebar, type DashboardTab } from "./Sidebar";
import { ContentLibrary } from "@/components/content/ContentLibrary";
import { FactoryWorkspace } from "@/components/factory/FactoryWorkspace";
import { BrandVoicePanel } from "@/components/settings/BrandVoicePanel";
import { defaultBrandSettings, demoActivityLogs, demoContentItems } from "@/lib/demo-data";
import type { ActivityLogItem, BrandSettings, ContentItem } from "@/lib/types";
import { createId, getCurrentTimeLabel } from "@/lib/utils";

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("factory");
  const [contentItems, setContentItems] = useState<ContentItem[]>(demoContentItems);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(demoActivityLogs);
  const [toastMessage, setToastMessage] = useState("");
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    ...defaultBrandSettings,
    selectedTone: defaultBrandSettings.tonePresets[1],
  });

  const activeLabel = useMemo(
    () => dashboardTabs.find((tab) => tab.key === activeTab)?.description ?? "Tạo nội dung video ngắn",
    [activeTab],
  );

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(""), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function addLog(label: string, type: ActivityLogItem["type"] = "info") {
    const newLog: ActivityLogItem = {
      id: createId("log"),
      label,
      timestamp: getCurrentTimeLabel(),
      type,
    };
    setActivityLogs((current) => [newLog, ...current].slice(0, 8));
  }

  function saveContent(item: ContentItem) {
    setContentItems((current) => [item, ...current]);
  }

  function duplicateContent(item: ContentItem) {
    const duplicatedItem: ContentItem = {
      ...item,
      id: createId("content"),
      title: `${item.title} (bản sao)`,
      status: "Draft",
      createdAt: new Intl.DateTimeFormat("vi-VN").format(new Date()),
    };
    setContentItems((current) => [duplicatedItem, ...current]);
    addLog("Đã nhân bản một content demo.", "success");
    setToastMessage("Đã nhân bản content demo.");
  }

  function deleteContent(item: ContentItem) {
    setContentItems((current) => current.filter((content) => content.id !== item.id));
    addLog(`Đã xoá UI item: ${item.title}.`, "warning");
    setToastMessage("Đã xoá item khỏi danh sách local.");
  }

  function viewContent(item: ContentItem) {
    addLog(`Đã mở xem nhanh: ${item.title}.`, "info");
    setToastMessage("View demo: chưa có trang chi tiết ở Phase 1.");
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <AppHeader activeLabel={activeLabel} />
      <div className="mx-auto flex max-w-[1500px]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {activeTab === "factory" ? (
            <FactoryWorkspace
              activityLogs={activityLogs}
              onAddLog={addLog}
              onSaveContent={saveContent}
              onToast={setToastMessage}
              brandSettings={brandSettings}
            />
          ) : null}

          {activeTab === "library" ? (
            <ContentLibrary
              items={contentItems}
              onView={viewContent}
              onDuplicate={duplicateContent}
              onDelete={deleteContent}
            />
          ) : null}

          {activeTab === "settings" ? (
            <BrandVoicePanel
              settings={brandSettings}
              onSettingsChange={setBrandSettings}
              onToast={setToastMessage}
            />
          ) : null}
        </main>
      </div>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {toastMessage ? (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-2xl border border-cyanSoft-300/20 bg-ink-850/95 px-4 py-3 text-center text-sm font-semibold text-white shadow-glow backdrop-blur-xl lg:bottom-6">
          {toastMessage}
        </div>
      ) : null}
    </div>
  );
}
