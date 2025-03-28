export function createResponse(isSuccess: boolean, data?: unknown) {
  return new Response(
    JSON.stringify({ isSuccess, data }),
    {
      status: isSuccess ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}