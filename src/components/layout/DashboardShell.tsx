"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppHeader } from "./AppHeader";
import { MobileNav } from "./MobileNav";
import { dashboardTabs, Sidebar, type DashboardTab } from "./Sidebar";
import { ContentLibrary } from "@/components/content/ContentLibrary";
import { FactoryWorkspace } from "@/components/factory/FactoryWorkspace";
import { BrandVoicePanel } from "@/components/settings/BrandVoicePanel";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { createContent, deleteContentApi, duplicateContentApi, fetchContentItems, updateContentStatusApi } from "@/lib/content-api";
import { defaultBrandSettings, demoActivityLogs, demoContentItems } from "@/lib/demo-data";
import type { ActivityLogItem, BrandSettings, ContentItem, ContentStatus, SaveContentInput } from "@/lib/types";
import { createId, getCurrentDateLabel, getCurrentTimeLabel } from "@/lib/utils";

type LibrarySource = "demo" | "supabase" | "local";
function getErrorMessage(error: unknown, fallbackMessage: string): string { if (error instanceof Error && error.message) return error.message; return fallbackMessage; }
function createLocalContentItem(input: SaveContentInput): ContentItem { return { id: createId("content"), title: input.title.trim() || "Nội dung video chưa đặt tên", hook: input.selectedHook, platform: input.platforms[0] ?? "TikTok", platforms: input.platforms, status: input.status, createdAt: getCurrentDateLabel(), rawIdea: input.rawIdea, scriptBody: input.scriptBody, visualCues: input.visualCues, slides: input.slides, caption: input.caption, hashtags: input.hashtags, cta: input.cta }; }

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("factory");
  const [contentItems, setContentItems] = useState<ContentItem[]>(demoContentItems);
  const [librarySource, setLibrarySource] = useState<LibrarySource>("demo");
  const [isLibraryLoading, setIsLibraryLoading] = useState(true);
  const [busyContentId, setBusyContentId] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(demoActivityLogs);
  const [toastMessage, setToastMessage] = useState("");
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({ ...defaultBrandSettings, selectedTone: "Thân thiện, truyền cảm hứng" });
  const activeLabel = useMemo(() => dashboardTabs.find((tab) => tab.key === activeTab)?.description ?? "Tạo nội dung video ngắn", [activeTab]);
  useEffect(() => { if (!toastMessage) return; const timeoutId = window.setTimeout(() => setToastMessage(""), 3200); return () => window.clearTimeout(timeoutId); }, [toastMessage]);
  const addLog = useCallback((label: string, type: ActivityLogItem["type"] = "info") => { const newLog: ActivityLogItem = { id: createId("log"), label, timestamp: getCurrentTimeLabel(), type }; setActivityLogs((current) => [newLog, ...current].slice(0, 10)); }, []);
  const loadContentLibrary = useCallback(async () => {
    setIsLibraryLoading(true); addLog("Đang tải Content Library từ Supabase...", "info");
    try { const result = await fetchContentItems(); if (result.usingFallback) { setContentItems((current) => (current.length ? current : demoContentItems)); setLibrarySource("demo"); addLog(result.error || "Supabase chưa cấu hình, đang dùng demo data.", "warning"); return; } if (result.items.length) { setContentItems(result.items); setLibrarySource("supabase"); addLog("Đã tải Content Library từ Supabase.", "success"); } else { setContentItems(demoContentItems); setLibrarySource("demo"); addLog("Supabase đã kết nối nhưng bảng chưa có dữ liệu, đang hiển thị demo data.", "info"); } }
    catch (error) { const message = getErrorMessage(error, "Không tải được Supabase, đang dùng demo data."); setContentItems((current) => (current.length ? current : demoContentItems)); setLibrarySource("demo"); addLog(`Lỗi tải Supabase: ${message}`, "warning"); setToastMessage("Không tải được Supabase, đang dùng dữ liệu demo."); }
    finally { setIsLibraryLoading(false); }
  }, [addLog]);
  useEffect(() => { void loadContentLibrary(); }, [loadContentLibrary]);
  async function saveContent(input: SaveContentInput) { addLog("Đang lưu content vào Supabase...", "info"); try { const item = await createContent(input); setContentItems((current) => [item, ...current.filter((content) => !content.id.startsWith("content-") || librarySource !== "demo")]); setLibrarySource("supabase"); setSelectedContent(item); addLog("Đã lưu content vào Supabase.", "success"); setToastMessage("Đã lưu vào Supabase Content Library."); } catch (error) { const localItem = createLocalContentItem(input); setContentItems((current) => [localItem, ...current]); setLibrarySource("local"); setSelectedContent(localItem); addLog(`Không lưu được Supabase: ${getErrorMessage(error, "đã lưu tạm local.")}`, "warning"); setToastMessage("Không lưu được Supabase, đã lưu tạm trên trình duyệt."); } }
  async function duplicateContent(item: ContentItem) { setBusyContentId(item.id); addLog(`Đang nhân bản content: ${item.title}.`, "info"); try { if (librarySource === "supabase") { const duplicatedItem = await duplicateContentApi(item.id); setContentItems((current) => [duplicatedItem, ...current]); setSelectedContent(duplicatedItem); addLog("Đã nhân bản content trong Supabase.", "success"); setToastMessage("Đã nhân bản content trong Supabase."); return; } const duplicatedItem: ContentItem = { ...item, id: createId("content"), title: `${item.title} (bản sao)`, status: "Draft", createdAt: getCurrentDateLabel() }; setContentItems((current) => [duplicatedItem, ...current]); setLibrarySource("local"); setSelectedContent(duplicatedItem); addLog("Đã nhân bản content local fallback.", "success"); setToastMessage("Đã nhân bản content local."); } catch (error) { const message = getErrorMessage(error, "Không nhân bản được Supabase."); addLog(`Lỗi duplicate: ${message}`, "warning"); setToastMessage("Không nhân bản được Supabase, hãy kiểm tra cấu hình."); } finally { setBusyContentId(null); } }
  async function deleteContent(item: ContentItem) { const confirmed = window.confirm(`Xoá content “${item.title}”?`); if (!confirmed) return; setBusyContentId(item.id); addLog(`Đang xoá content: ${item.title}.`, "warning"); try { if (librarySource === "supabase") await deleteContentApi(item.id); setContentItems((current) => current.filter((content) => content.id !== item.id)); setSelectedContent((current) => (current?.id === item.id ? null : current)); addLog(librarySource === "supabase" ? "Đã xoá content khỏi Supabase." : "Đã xoá content local/demo.", "success"); setToastMessage("Đã xoá content."); } catch (error) { const message = getErrorMessage(error, "Không xoá được Supabase."); addLog(`Lỗi delete: ${message}`, "warning"); setToastMessage("Không xoá được Supabase, hãy thử lại."); } finally { setBusyContentId(null); } }
  async function updateContentStatus(item: ContentItem, status: ContentStatus) { if (item.status === status) return; setBusyContentId(item.id); addLog(`Đang cập nhật trạng thái thành ${status}...`, "info"); try { if (librarySource === "supabase") { const updatedItem = await updateContentStatusApi(item.id, status); setContentItems((current) => current.map((content) => (content.id === item.id ? updatedItem : content))); setSelectedContent((current) => (current?.id === item.id ? updatedItem : current)); addLog("Đã cập nhật trạng thái trong Supabase.", "success"); setToastMessage("Đã cập nhật trạng thái Supabase."); return; } const updatedItem: ContentItem = { ...item, status }; setContentItems((current) => current.map((content) => (content.id === item.id ? updatedItem : content))); setSelectedContent((current) => (current?.id === item.id ? updatedItem : current)); setLibrarySource("local"); addLog("Đã cập nhật trạng thái local fallback.", "success"); setToastMessage("Đã cập nhật trạng thái local."); } catch (error) { const message = getErrorMessage(error, "Không cập nhật được Supabase."); addLog(`Lỗi update status: ${message}`, "warning"); setToastMessage("Không cập nhật được Supabase, hãy kiểm tra lại."); } finally { setBusyContentId(null); } }
  function viewContent(item: ContentItem) { setSelectedContent(item); addLog(`Đã mở xem nhanh: ${item.title}.`, "info"); setToastMessage("Đã mở xem nhanh content."); }
  function handleCreateNew() { setActiveTab("factory"); addLog("Dự án mới được tạo trong Create Studio.", "info"); setToastMessage("Đã mở Create Studio."); }
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <AppHeader activeLabel={activeLabel} onCreateNew={handleCreateNew} />
      <div className="mx-auto flex max-w-[1680px]"><Sidebar activeTab={activeTab} onTabChange={setActiveTab} /><main className="min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-6 lg:py-6 2xl:px-8">
        {activeTab === "factory" ? <FactoryWorkspace activityLogs={activityLogs} onAddLog={addLog} onSaveContent={saveContent} onToast={setToastMessage} brandSettings={brandSettings} onBrandSettingsChange={setBrandSettings} /> : null}
        {activeTab === "library" ? <ContentLibrary items={contentItems} source={librarySource} isLoading={isLibraryLoading} busyItemId={busyContentId} selectedItem={selectedContent} onView={viewContent} onDuplicate={duplicateContent} onDelete={deleteContent} onStatusChange={updateContentStatus} onRefresh={loadContentLibrary} /> : null}
        {activeTab === "brand" ? <BrandVoicePanel settings={brandSettings} onSettingsChange={setBrandSettings} onToast={setToastMessage} /> : null}
        {activeTab === "settings" ? <SettingsPanel /> : null}
      </main></div>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      {toastMessage ? <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-2xl border border-cyanSoft-300/20 bg-ink-850/95 px-4 py-3 text-center text-sm font-semibold text-white shadow-glow backdrop-blur-xl lg:bottom-6">{toastMessage}</div> : null}
    </div>
  );
}
