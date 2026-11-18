// Phones and tablets (iPadOS reports a desktop Mac UA, hence the touch check).
// Desktop browsers may also expose navigator.share, but there the expected
// behaviour is copy-link / file download, not a share sheet.
export function isMobileDevice() {
  const ua = navigator.userAgent;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard API unavailable (insecure context / old browser).
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

// Native share sheet on mobile (text + URL); everywhere else, or if the share
// call fails for a reason other than the user dismissing it, copy instead.
// Returns true when the text was copied, so the caller can show a toast.
export async function shareOrCopy(title: string, text: string, url: string): Promise<boolean> {
  if (isMobileDevice() && typeof navigator.share === "function") {
    try {
      // Link goes inside `text`: many apps drop the separate `url` field.
      await navigator.share({ title, text: `${text}\n${url}` });
      return false;
    } catch (e) {
      if ((e as DOMException)?.name === "AbortError") return false;
    }
  }
  await copyText(`${text}\n${url}`);
  return true;
}
