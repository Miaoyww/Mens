import { isTauri } from "@tauri-apps/api/core";

const DISPLAY_LABEL = "display";

export async function openDisplayWindow(): Promise<void> {
  // Browser fallback (non-Tauri dev mode)
  if (!isTauri()) {
    window.open(
      "/display",
      DISPLAY_LABEL,
      "width=1280,height=800,resizable=yes",
    );
    return;
  }

  const { WebviewWindow } = await import("@tauri-apps/api/webviewWindow");

  // Avoid duplicate windows: reuse existing one
  const existing = await WebviewWindow.getByLabel(DISPLAY_LABEL);
  if (existing) {
    await existing.unminimize();
    await existing.show();
    await existing.setFocus();
    return;
  }

  // Create a fresh display window
  new WebviewWindow(DISPLAY_LABEL, {
    url: "/display",
    title: "Mens - 菜单展示",
    width: 1280,
    height: 800,
    decorations: false,
    resizable: true,
    center: true,
  });
}
