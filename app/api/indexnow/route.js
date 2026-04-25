export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return Response.json({ error: 'INDEXNOW_KEY environment variable not set' }, { status: 500 });
  }
  return Response.json({ key });
}
