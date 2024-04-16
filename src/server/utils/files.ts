import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "~/env";

const s3Client = new S3Client({
  region: "apac",
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export async function uploadFile(buffer: Buffer, key: string) {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
    }),
  );
}

export async function deleteFile(key: string) {
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    }),
  );
}
