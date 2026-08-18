const API_BASE_URL = '/api';

export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (err) {
    return { status: 'OFFLINE', database: 'Disconnected' };
  }
}

export async function sendUrlScanToBackend(url: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/scan/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend server offline, falling back to local client analyzer');
    return null;
  }
}

export async function fetchSavedReports() {
  try {
    const res = await fetch(`${API_BASE_URL}/reports`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function saveReportToBackend(content: string, title: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, report_title: title, author: 'shivanshutiwari481-dot' })
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}
