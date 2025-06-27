import { create } from "zustand";

import { FileUpload, UserStorageStats } from "@/services/storage-service";

interface StorageState {
  // Cache storage only
  files: Record<string, FileUpload>; // fileId -> FileUpload
  userFiles: string[]; // fileIds[]
  storageStats: UserStorageStats | null;
  lastStatsUpdate: string | null;

  // Actions
  setFile: (file: FileUpload) => void;
  setFiles: (files: FileUpload[]) => void;
  setUserFiles: (files: FileUpload[]) => void;
  setStorageStats: (stats: UserStorageStats) => void;
  addFile: (file: FileUpload) => void;
  updateFile: (fileId: string, updates: Partial<FileUpload>) => void;
  removeFile: (fileId: string) => void;
  getFile: (fileId: string) => FileUpload | undefined;
  getUserFiles: () => FileUpload[];
  getStorageStats: () => UserStorageStats | null;
  isStatsStale: (maxAgeMinutes?: number) => boolean;
  clearFile: (fileId: string) => void;
  clearUserFiles: () => void;
  clearStorageStats: () => void;
  clearAll: () => void;
}

export const useStorageStore = create<StorageState>((set, get) => ({
  files: {},
  userFiles: [],
  storageStats: null,
  lastStatsUpdate: null,

  setFile: (file) =>
    set((state) => ({
      files: { ...state.files, [file._id]: file },
    })),

  setFiles: (files) =>
    set((state) => {
      const newFiles = { ...state.files };
      files.forEach((file) => {
        newFiles[file._id] = file;
      });
      return { files: newFiles };
    }),

  setUserFiles: (files) =>
    set((state) => {
      const fileIds = files.map((file) => file._id);
      const newFiles = { ...state.files };

      // Store individual files in cache
      files.forEach((file) => {
        newFiles[file._id] = file;
      });

      return {
        files: newFiles,
        userFiles: fileIds,
      };
    }),

  setStorageStats: (stats) =>
    set({
      storageStats: stats,
      lastStatsUpdate: new Date().toISOString(),
    }),

  addFile: (file) =>
    set((state) => ({
      files: { ...state.files, [file._id]: file },
      userFiles: [...state.userFiles, file._id],
      // Update storage stats if available
      storageStats: state.storageStats
        ? {
            ...state.storageStats,
            used: state.storageStats.used + file.size,
            remaining: state.storageStats.remaining - file.size,
          }
        : null,
    })),

  updateFile: (fileId, updates) =>
    set((state) => {
      const existingFile = state.files[fileId];
      if (!existingFile) return state;

      const updatedFile = { ...existingFile, ...updates };
      return {
        files: { ...state.files, [fileId]: updatedFile },
      };
    }),

  removeFile: (fileId) =>
    set((state) => {
      const file = state.files[fileId];
      const newFiles = { ...state.files };
      delete newFiles[fileId];

      return {
        files: newFiles,
        userFiles: state.userFiles.filter((id) => id !== fileId),
        // Update storage stats if available
        storageStats:
          state.storageStats && file
            ? {
                ...state.storageStats,
                used: state.storageStats.used - file.size,
                remaining: state.storageStats.remaining + file.size,
              }
            : state.storageStats,
      };
    }),

  getFile: (fileId) => get().files[fileId],

  getUserFiles: () => {
    const state = get();
    return state.userFiles.map((id) => state.files[id]).filter(Boolean);
  },

  getStorageStats: () => get().storageStats,

  isStatsStale: (maxAgeMinutes = 15) => {
    const state = get();
    if (!state.lastStatsUpdate) return true;

    const lastUpdate = new Date(state.lastStatsUpdate);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);

    return diffMinutes > maxAgeMinutes;
  },

  clearFile: (fileId) =>
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[fileId];
      return {
        files: newFiles,
        userFiles: state.userFiles.filter((id) => id !== fileId),
      };
    }),

  clearUserFiles: () => set({ userFiles: [] }),

  clearStorageStats: () => set({ storageStats: null, lastStatsUpdate: null }),

  clearAll: () =>
    set({
      files: {},
      userFiles: [],
      storageStats: null,
      lastStatsUpdate: null,
    }),
}));