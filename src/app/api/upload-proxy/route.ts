export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const uploadUrl = String(formData.get('uploadUrl') ?? '')
    const contentType = String(formData.get('contentType') ?? 'application/octet-stream')
    const file = formData.get('file')

    if (!uploadUrl) {
      return new Response(JSON.stringify({ message: 'Missing uploadUrl' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!(file instanceof Blob)) {
      return new Response(JSON.stringify({ message: 'Missing file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const upstream = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file,
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '')
      return new Response(
        JSON.stringify({
          message: 'Upstream upload failed',
          status: upstream.status,
          statusText: upstream.statusText,
          details: text,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(null, { status: 204 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return new Response(JSON.stringify({ message: msg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
