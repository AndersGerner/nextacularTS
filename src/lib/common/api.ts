async function api<Request>(
  url: string,
  options: Omit<RequestInit, 'body'> & { body?: Request }
) {
  const { body, ...opts } = options
  const requestBody = JSON.stringify(body)
  const response = await fetch(url, {
    body: requestBody,
    headers: {
      ...(opts.headers as RequestInit['headers']),
      'Content-Type': 'application/json',
    },
    ...opts,
  })
  const result = await response.json()
  return { status: response.status, ...result, url }
}

export default api
