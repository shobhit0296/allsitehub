import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), "src", "app");
const DELETED_FILE = path.join(DATA_DIR, "deleted_sites.json");
const CUSTOM_SITES_FILE = path.join(DATA_DIR, "custom_sites.json");

declare global {
  var __allsitehub_deleted_ids: string[] | undefined;
  var __allsitehub_custom_sites: any[] | undefined;
}

export async function GET() {
  try {
    let fileDeleted: string[] = [];
    let fileCustom: any[] = [];

    if (fs.existsSync(DELETED_FILE)) {
      try {
        const data = fs.readFileSync(DELETED_FILE, "utf-8");
        fileDeleted = JSON.parse(data);
      } catch (e) {}
    }

    if (fs.existsSync(CUSTOM_SITES_FILE)) {
      try {
        const data = fs.readFileSync(CUSTOM_SITES_FILE, "utf-8");
        fileCustom = JSON.parse(data);
      } catch (e) {}
    }

    const memoryDeleted = globalThis.__allsitehub_deleted_ids || [];
    const memoryCustom = globalThis.__allsitehub_custom_sites || [];

    const deletedIds = Array.from(new Set([...fileDeleted, ...memoryDeleted].map((id: string) => id.toLowerCase())));
    const customSites = memoryCustom.length > 0 ? memoryCustom : fileCustom;

    return NextResponse.json(
      { deletedIds, customSites },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ deletedIds: [], customSites: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deletedIds, customSites } = body;

    if (Array.isArray(deletedIds)) {
      globalThis.__allsitehub_deleted_ids = deletedIds;
      try {
        fs.writeFileSync(DELETED_FILE, JSON.stringify(deletedIds, null, 2), "utf-8");
      } catch (e) {}
    }

    if (Array.isArray(customSites)) {
      globalThis.__allsitehub_custom_sites = customSites;
      try {
        fs.writeFileSync(CUSTOM_SITES_FILE, JSON.stringify(customSites, null, 2), "utf-8");
      } catch (e) {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to persist" }, { status: 500 });
  }
}
