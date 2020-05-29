export default () => {
  let servicew;
  //// Generate on server
  const publicKey =
    "BBplhidqNPeLGzhIeXbQf736vi_WOJA3_b8mPS_0a1IWE77wQzojHmgLRw9ks4AQ3NpbSrSOgaD9Sqw4ghTlVfA";

  if ("serviceWorker" in navigator && "PushManager" in window) {
    /// get the service worker and then look if we have already a subscription
    navigator.serviceWorker.ready.then((sw) => {
      servicew = sw;
      sw.pushManager.getSubscription().then((subscription) => {
        console.log("Is subscribed: ", subscription);
      });
    });
  }

  const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  /// Send our endpoint to be used on the server

  async function saveSubscription(subscription) {
    const url =
      "https://push-notifications-api.herokuapp.com/api/notifications/save";

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  }

  document.querySelector("#notify").addEventListener("click", (event) => {
    event.srcElement.disabled = true;

    servicew.pushManager.getSubscription().then(async (subscription) => {
      try {
        //Börja prenumerera på push notiser och returnerar en subscription med en endpoint
        //som vi sparar på servern
        const subscribed = await servicew.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(publicKey),
        });
        saveSubscription(subscribed);
        console.log(subscribed);
        createNotification();
        event.srcElement.disabled = false;
      } catch (error) {}
    });
  });

  function createNotification() {
    const icon = "image/icon/apple-touch-icon.png";
    const message = "Thank you for subscribing to our notification";

    const notification = new Notification("Instablam", {
      body: message,
      icon: icon,
    });

    notification.addEventListener("click", (event) => {
      window.open("http://localhost:5050/");
    });
  }
};
