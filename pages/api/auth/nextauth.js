// Duplicate file was conflicting with [...nextauth].js route.
// Keeping empty to avoid route collision. You can safely delete this file.
export default function handler(req, res) {
  res.status(404).json({ error: "Not Found" });
}
