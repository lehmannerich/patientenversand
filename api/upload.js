import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function upload(request, response) {
  try {
    const form = formidable({});
    const [fields, files] = await form.parse(request);
    const file = files.file?.[0];

    if (!file) {
      return response.status(400).json({ error: "No file provided" });
    }

    const fileStream = fs.createReadStream(file.filepath);

    const blob = await put(file.originalFilename, fileStream, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.mimetype,
    });

    await fs.promises.unlink(file.filepath);

    return response.status(200).json(blob);
  } catch (error) {
    console.error("Upload failed:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
