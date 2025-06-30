import { apolloClient } from "@/lib/apollo/apollo-client";
import {
  COMPLETE_FILE_MUTATION,
  CREATE_FILE_MUTATION,
  DELETE_FILE_MUTATION,
  GET_USER_FILES_QUERY,
  GET_USER_STORAGE_STATS_QUERY,
} from "@/lib/graphql";
import { formatNullableResult, formatResult } from "@/lib/utils/service.utils";

// DTOs (Inputs)
export interface FilePart {
  etag: string;
  partNumber: number;
}

export interface CompleteFileInput {
  fileId: string;
  parts: FilePart[];
}

export interface CreateFileInput {
  filename: string;
  mimetype: string;
  size: number;
}

// Outputs
export interface FileUpload {
  _id: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadId?: string;
  clientToken?: string;
  createdAt: string;
}

export interface UserStorageStats {
  used: number;
  limit: number;
  remaining: number;
}

// Actions
async function createFile(input: CreateFileInput) {
  const { data, errors } = await apolloClient.mutate<{
    createFile: FileUpload;
  }>({
    mutation: CREATE_FILE_MUTATION,
    variables: { input },
    fetchPolicy: "network-only",
  });
  return formatResult<FileUpload>(data?.createFile, errors);
}

async function completeFileUpload(input: CompleteFileInput) {
  const { data, errors } = await apolloClient.mutate<{
    completeFile: FileUpload;
  }>({
    mutation: COMPLETE_FILE_MUTATION,
    variables: { input },
    fetchPolicy: "network-only",
  });
  return formatResult<FileUpload>(data?.completeFile, errors);
}

async function deleteFile(fileId: string) {
  const { data, errors } = await apolloClient.mutate<{
    deleteFile: boolean;
  }>({
    mutation: DELETE_FILE_MUTATION,
    variables: { id: fileId },
    fetchPolicy: "network-only",
  });
  return formatResult<boolean>(data?.deleteFile, errors);
}

async function getUserFiles() {
  const { data, errors } = await apolloClient.query<{
    getUserFiles: FileUpload[];
  }>({
    query: GET_USER_FILES_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<FileUpload[]>(data?.getUserFiles, errors);
}

async function getFileById(fileId: string) {
  const { data, errors } = await apolloClient.query<{ file?: FileUpload }>({
    query: GET_USER_FILES_QUERY,
    variables: { id: fileId },
    fetchPolicy: "network-only",
  });

  return formatNullableResult<FileUpload>(data?.file, errors);
}

async function getUserStorageStats() {
  const { data, errors } = await apolloClient.query<{
    getUserStorageStats: UserStorageStats;
  }>({
    query: GET_USER_STORAGE_STATS_QUERY,
    fetchPolicy: "network-only",
  });

  return formatResult<UserStorageStats>(data?.getUserStorageStats, errors);
}

export const StorageService = {
  createFile,
  completeFileUpload,
  deleteFile,
  getUserFiles,
  getFileById,
  getUserStorageStats,
};
