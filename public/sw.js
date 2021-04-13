self.addEventListener('push', function(e) {
    const options = {
        body: 'Du har fått en ny melding!',
        icon: 'images/example.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        },
        actions: [
            {action: 'close', title: 'View',
                icon: 'images/checkmark.png'},
            {action: 'close', title: 'Close',
                icon: 'images/xmark.png'},
        ]
    };
    e.waitUntil(
        self.registration.showNotification('ChatMet.com', options)
    );
});