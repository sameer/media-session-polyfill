browser.runtime.onMessage.addListener(
    (message: any, sender: any): boolean => {
        return true;
    });
