function requestNotificationPermission() {
  Notification.requestPermission().then((response) => {
    console.log(response);
  });
}

/* function createNotification() {
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
 */
export { requestNotificationPermission /* , createNotification */ };
