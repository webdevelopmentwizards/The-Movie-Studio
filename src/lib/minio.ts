import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { readFile } from "fs/promises";

let client: S3Client | null = null;
let bucketReady: Promise<void> | null = null;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }
  return value;
}

export function isMinioConfigured(): boolean {
  return Boolean(
    process.env.MINIO_ENDPOINT?.trim() &&
      process.env.MINIO_ACCESS_KEY?.trim() &&
      process.env.MINIO_SECRET_KEY?.trim() &&
      process.env.MINIO_BUCKET?.trim(),
  );
}

function getClient(): S3Client {
  if (client) return client;

  const endpointHost = requireEnv("MINIO_ENDPOINT").replace(/\/$/, "");
  const port = process.env.MINIO_PORT?.trim() || "9000";
  const useSsl = process.env.MINIO_USE_SSL === "true";
  const protocol = useSsl ? "https" : "http";
  const endpoint = endpointHost.includes("://")
    ? endpointHost
    : `${protocol}://${endpointHost}:${port}`;

  client = new S3Client({
    region: process.env.MINIO_REGION?.trim() || "us-east-1",
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: requireEnv("MINIO_ACCESS_KEY"),
      secretAccessKey: requireEnv("MINIO_SECRET_KEY"),
    },
  });

  return client;
}

async function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const bucket = requireEnv("MINIO_BUCKET");
      const s3 = getClient();
      try {
        await s3.send(new HeadBucketCommand({ Bucket: bucket }));
      } catch {
        await s3.send(new CreateBucketCommand({ Bucket: bucket }));
      }
    })().catch((error) => {
      bucketReady = null;
      throw error;
    });
  }
  await bucketReady;
}

function publicUrlForKey(objectKey: string): string {
  const configured = process.env.MINIO_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    return `${configured}/${objectKey}`;
  }

  const endpointHost = requireEnv("MINIO_ENDPOINT").replace(/\/$/, "");
  const port = process.env.MINIO_PORT?.trim() || "9000";
  const useSsl = process.env.MINIO_USE_SSL === "true";
  const protocol = useSsl ? "https" : "http";
  const bucket = requireEnv("MINIO_BUCKET");
  const host = endpointHost.includes("://")
    ? endpointHost
    : `${protocol}://${endpointHost}:${port}`;
  return `${host}/${bucket}/${objectKey}`;
}

function safeFilename(name: string): string {
  return name.replace(/[^\w.\-]+/g, "_");
}

export type MinioUploadResult = {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
};

export async function uploadAuditionFile(params: {
  localPath: string;
  originalFilename: string;
  contentType?: string | null;
  kind: "video" | "photo";
}): Promise<MinioUploadResult> {
  await ensureBucket();

  const bucket = requireEnv("MINIO_BUCKET");
  const buffer = await readFile(params.localPath);
  const filename = safeFilename(params.originalFilename || params.kind);
  const objectKey = `auditions/${params.kind}/${Date.now()}-${randomUUID().slice(0, 8)}-${filename}`;
  const contentType =
    params.contentType?.trim() ||
    (params.kind === "video" ? "video/mp4" : "image/jpeg");

  await getClient().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: buffer,
      ContentType: contentType,
      ContentLength: buffer.length,
    }),
  );

  return {
    key: objectKey,
    url: publicUrlForKey(objectKey),
    filename,
    contentType,
    size: buffer.length,
  };
}
