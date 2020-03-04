document.addEventListener('keyup', event => {
    browser.runtime.sendMessage({ key: event.key, shiftKey: event.shiftKey, ctrlKey: event.ctrlKey }).catch(console.error);
});
