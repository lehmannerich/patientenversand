import { put } from "@vercel/blob";

export const config = {
  runtime: "edge",
};

export default async function upload(request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!file) {
    return new Response(JSON.stringify({ error: "No file provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return new Response(JSON.stringify(blob), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
