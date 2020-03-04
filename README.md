# media-session-polyfill

Adds Media Session API support to popular media sites with basic controls via system play/pause buttons.

## Building

```bash
yarn build
web-ext build
```

## TO-DO

- [ ] Site Support
    - [x] Amazon Music: play/pause/next/prev
    - [ ] Spotify
    - [x] Youtube: pause/play only
    - [x] Prime Video: play/pause only
        - They check [isTrusted](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) and ignore dispatched mouse/key events
        - Maybe there is another means of global detection?
- [ ] System Support
    - [x] Linux
    - [ ] MacOS
    - [ ] Windows: media keys intercepted by OS
- [ ] Key Support
    - [x] Play/Pause, Prev, Next (keyboard, bluetooth headphones, etc.)
- [ ] System Integration
    - [ ] MPRIS on Linux: if keys are bound by the window manager, can't be seen by the browser
        - [ ] playerctl
    - [ ] Windows equivalent for MPRIS (?)
- [ ] Media Key Commands: currently just listens for key up events anywhere in the browser
    - [ ] File Firefox bug for extensions seeing all media commands as the first registered command

## Known Bugs/Issues

* https://bugzilla.mozilla.org/show_bug.cgi?id=1251795
* https://bugzilla.mozilla.org/show_bug.cgi?id=1411795
