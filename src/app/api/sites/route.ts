import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "app");
const DELETED_FILE = path.join(DATA_DIR, "deleted_sites.json");
const CUSTOM_SITES_FILE = path.join(DATA_DIR, "custom_sites.json");

export async function GET() {
  try {
    let deletedIds: string[] = [];
    let customSites: any[] = [];

    if (fs.existsSync(DELETED_FILE)) {
      const data = fs.readFileSync(DELETED_FILE, "utf-8");
      deletedIds = JSON.parse(data);
    }

    if (fs.existsSync(CUSTOM_SITES_FILE)) {
      const data = fs.readFileSync(CUSTOM_SITES_FILE, "utf-8");
      customSites = JSON.parse(data);
    }

    return NextResponse.json({ deletedIds, customSites });
  } catch (error) {
    return NextResponse.json({ deletedIds: [], customSites: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deletedIds, customSites } = body;

    if (Array.isArray(deletedIds)) {
      fs.writeFileSync(DELETED_FILE, JSON.stringify(deletedIds, null, 2), "utf-8");
    }

    if (Array.isArray(customSites)) {
      fs.writeFileSync(CUSTOM_SITES_FILE, JSON.stringify(customSites, null, 2), "utf-8");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to persist" }, { status: 500 });
  }
}
