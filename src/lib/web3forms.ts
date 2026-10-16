/**
 * Submits form data to Web3Forms which delivers it directly to the configured email inbox.
 * Free access key can be obtained at https://web3forms.com
 * Set VITE_WEB3FORMS_KEY in your environment variables.
 */
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export async function submitToWeb3Forms(
  subject: string,
  fields: Record<string, string | null | undefined>
): Promise<{ ok: boolean; error?: string }> {
  if (!WEB3FORMS_KEY) {
    // If no key is configured, client-side capture continues normally
    return { ok: true };
  }

  const body: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject,
    from_name: "Progressive Abia Youths Website",
  };

  for (const [k, v] of Object.entries(fields)) {
    if (v != null && v !== "") body[k] = v;
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      return { ok: false, error: json.message ?? "Submission failed" };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? "Network error" };
  }
}
