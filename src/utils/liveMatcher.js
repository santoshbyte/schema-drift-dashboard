const PROXY_URL =
  import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';

export async function classifyField({
  removedField,
  candidateFields,
  siblingFields = []
}) {
  const response = await fetch(`${PROXY_URL}/api/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      removed_field: removedField,
      candidate_fields: candidateFields,
      sibling_fields: siblingFields
    })
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error('Proxy returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(
      data.detail ||
      data.error ||
      `Classification failed with HTTP ${response.status}`
    );
  }

  return data;
}