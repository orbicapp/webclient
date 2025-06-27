import { useEffect, useState } from "react";

import {
  FileUpload,
  StorageService,
  UserStorageStats,
} from "@/services/storage-service";
import { useStorageStore } from "@/stores/storage-store";

/**
 * Hook to fetch and cache user files
 */
export const useUserFiles = (): [boolean, FileUpload[], string | null] => {
  const { getUserFiles, setUserFiles } = useStorageStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const files = getUserFiles();

  useEffect(() => {
    // If files are already in cache, don't fetch
    if (files.length > 0) {
      setInitialized(true);
      return;
    }

    const fetchUserFiles = async () => {
      setLoading(true);
      setError(null);

      const [files, error] = await StorageService.getUserFiles();
      if (files) {
        setUserFiles(files);
      } else {
        setError(error || "Failed to fetch user files");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchUserFiles();
  }, [files.length, setUserFiles]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, [], null];
  }

  return [loading, files, error];
};

/**
 * Hook to fetch and cache storage statistics
 */
export const useStorageStats = (
  forceRefresh = false
): [boolean, UserStorageStats | null, string | null] => {
  const { getStorageStats, setStorageStats, isStatsStale } = useStorageStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const stats = getStorageStats();
  const shouldFetch = forceRefresh || !stats || isStatsStale();

  useEffect(() => {
    // If stats are fresh and not forcing refresh, don't fetch
    if (!shouldFetch) {
      setInitialized(true);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      const [stats, error] = await StorageService.getUserStorageStats();
      if (stats) {
        setStorageStats(stats);
      } else {
        setError(error || "Failed to fetch storage statistics");
      }

      setLoading(false);
      setInitialized(true);
    };

    fetchStats();
  }, [shouldFetch, setStorageStats]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, stats, error];
};

/**
 * Hook to get a specific file
 */
export const useFile = (
  fileId: string
): [boolean, FileUpload | null, string | null] => {
  const { getFile, setFile } = useStorageStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const file = getFile(fileId);

  useEffect(() => {
    // If file is already in cache or no fileId, don't fetch
    if (file || !fileId) {
      setInitialized(true);
      return;
    }

    const fetchFile = async () => {
      setLoading(true);
      setError(null);

      const [file, error] = await StorageService.getFileById(fileId);
      if (file) {
        setFile(file);
      } else if (error) {
        setError(error);
      }
      // Note: No error if file is null (file not found)

      setLoading(false);
      setInitialized(true);
    };

    fetchFile();
  }, [fileId, file, setFile]);

  // Don't return data until first fetch attempt is complete
  if (!initialized) {
    return [true, null, null];
  }

  return [loading, file || null, error];
};
