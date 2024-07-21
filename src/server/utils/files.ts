import {
  CreateBucketCommand,
  DeleteObjectCommand,
  NoSuchBucket,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "~/env";

const s3Client = new S3Client({
  forcePathStyle: true,
  region: env.S3_BUCKET_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
});

export async function uploadFile(buffer: Buffer, key: string) {
  try {
    return await s3Client.send(
      new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
      }),
    );
  } catch (error) {
    if (error.Code === NoSuchBucket.name) {
      await s3Client.send(
        new CreateBucketCommand({
          Bucket: env.S3_BUCKET_NAME,
          ACL: "public-read",
        }),
      );

      // Configure CORS
      const corsConfiguration = {
        Bucket: env.S3_BUCKET_NAME,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedOrigins: ["*"],
              AllowedMethods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
              AllowedHeaders: ["*"],
              MaxAgeSeconds: 3000,
            },
          ],
        },
      };

      await s3Client.send(new PutBucketCorsCommand(corsConfiguration));

      return await s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
        }),
      );
    }
    throw error;
  }
}

export async function deleteFile(key: string) {
  return await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    }),
  );
}
