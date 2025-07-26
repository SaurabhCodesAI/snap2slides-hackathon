export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Upload failed');
  return data.url;
}
