const LUNAE_URL = process.env.LUNAE_URL;

async function askLunae(message) {
  if (!LUNAE_URL) {
    throw new Error("LUNAE_URL is not configured.");
  }

  const response = await fetch(LUNAE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || `Lunae returned HTTP ${response.status}.`
    );
  }

  return data?.response || data?.answer || "Lunae returned no response.";
}

module.exports = {
  askLunae,
};