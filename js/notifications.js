function requestNotificationPermission() {
  Notification.requestPermission().then((response) => {
    console.log(response);
  });
}

export { requestNotificationPermission /* , createNotification */ };
