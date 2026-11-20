/* Uffish Web Push receiver. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
function uffishPayload(event) {
  try {
    const data = event.data ? event.data.json() : null;
    if (data && typeof data === "object") return data;
  } catch (e) { /* unreadable: fall back below */ }
  return {};
}
self.addEventListener("push", (event) => {
  const data = uffishPayload(event);
  const title = typeof data.title === "string" && data.title ? data.title : "Uffish";
  const body = typeof data.body === "string" ? data.body : "(no payload)";
  event.waitUntil(
    self.registration.showNotification(title, { body, data }).catch(() =>
      self.registration.showNotification("Uffish", { body: "(no payload)" })
    )
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url;
  if (typeof url === "string" && (url.startsWith("obsidian://") || url.startsWith("https://"))) {
    event.waitUntil(self.clients.openWindow(url));
  }
});
