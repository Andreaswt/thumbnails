"use server";

import AWS from "aws-sdk";
import { getServerSession } from "next-auth";
import { env } from "~/env";
import { authOptions } from "~/server/auth";
import { format } from "date-fns";
import { redirect } from "next/navigation";

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
});

export const getPresignedUrl = async () => {
  const serverSession = await getServerSession(authOptions);

  if (!serverSession) {
    throw new Error("User not authenticated");
  }

  const timestamp = format(new Date(), "yyyyMMddHHmmss");
  const key = `${serverSession?.user.id}/${timestamp}.png`;

  const params = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 60,
    ContentType: "image/png",
  };

  const uploadUrl = s3.getSignedUrl("putObject", params);

  return uploadUrl;
};

export const downloadS3File = async (url: string) => {
  const serverSession = await getServerSession(authOptions);

  if (!serverSession) {
    throw new Error("User not authenticated");
  }

  const key = url.replace(
    `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/`,
    "",
  );

  const params = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 3600,
    ResponseContentDisposition: 'attachment; filename="thumbnail.png"',
  };

  const downloadUrl = s3.getSignedUrl("getObject", params);

  redirect(downloadUrl);
};
