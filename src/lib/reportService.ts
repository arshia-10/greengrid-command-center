import { db } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

const firestoreDb = db as any;

const STORAGE_PREFIX = "greengrid:reports:";

function localKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function serializeReports(reports: any[]) {
  return JSON.stringify(
    reports.map((r) => ({ ...r, createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt }))
  );
}

function deserializeReports(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as any[];
    return parsed.map((r) => ({ ...r, createdAt: r.createdAt ? new Date(r.createdAt) : null }));
  } catch (e) {
    return [];
  }
}

export async function saveReport(userId: string, report: any) {
  // Ensure createdAt is a Date for local storage
  const now = report.createdAt ? new Date(report.createdAt) : new Date();
  const reportToSave = { ...report, createdAt: now, createdByUserId: userId };

  // Try Firestore first (best-effort)
  try {
    const docRef = await addDoc(collection(firestoreDb, "reports"), reportToSave);
    const saved = { id: docRef.id, ...reportToSave };
    // Also persist locally so UI is refresh-safe
    const existing = await getLocalReports(userId);
    const merged = [saved, ...existing];
    localStorage.setItem(localKey(userId), serializeReports(merged));
    return saved;
  } catch (e) {
    // Firestore failed (offline/mock) -> persist locally only
    const fallback = { id: `local-${Date.now()}`, ...reportToSave };
    const existing = await getLocalReports(userId);
    const merged = [fallback, ...existing];
    localStorage.setItem(localKey(userId), serializeReports(merged));
    return fallback;
  }
}

export async function getLocalReports(userId: string) {
  const raw = localStorage.getItem(localKey(userId));
  return deserializeReports(raw);
}

export async function getUserReports(userId: string) {
  // Try Firestore; on failure or empty, fall back to localStorage
  try {
    const q = query(collection(firestoreDb, "reports"), where("createdByUserId", "==", userId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const reports = snap.docs.map((d: any) => {
      const data = d.data();
      const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate() : data.createdAt ? new Date(data.createdAt) : null;
      return { id: d.id, ...data, createdAt };
    });

    if (reports.length) {
      // update local cache
      localStorage.setItem(localKey(userId), serializeReports(reports));
      return reports;
    }

    // If Firestore returned no docs, still attempt to return local cache
    return await getLocalReports(userId);
  } catch (e) {
    return await getLocalReports(userId);
  }
}

export async function getLatestUserReports(userId: string, limitCount = 3) {
  const reports = await getUserReports(userId);
  // Ensure sorted by createdAt desc
  const sorted = reports.slice().sort((a: any, b: any) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
  return sorted.slice(0, limitCount);
}

export default {
  saveReport,
  getUserReports,
  getLatestUserReports,
};
