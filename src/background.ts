// import * as browser from 'webextension-polyfill';
import * as dbus from 'dbus-next';

const MPRIS_IFACE = 'org.mpris.MediaPlayer2.Player';
const MPRIS_PATH = '/org/mpris/MediaPlayer2';
const PROPERTIES_IFACE = 'org.freedesktop.DBus.Properties';

const bus = dbus.sessionBus();

let {
    Interface, property, method, signal,
    ACCESS_READ, ACCESS_WRITE, ACCESS_READWRITE
} = dbus.interface;

class MPRISInterface extends Interface {
    @property({ signature: 's', access: ACCESS_READ })
    PlaybackStatus: string = 'stopped';

    @method({ inSignature: '', outSignature: '' })
    Next(): void {
    }

    @method({ inSignature: '', outSignature: '' })
    Previous(): void {
    }

    @method({ inSignature: '', outSignature: '' })
    Pause(): void {
    }

    @method({ inSignature: '', outSignature: '' })
    PlayPause(): void {
    }

    @method({ inSignature: '', outSignature: '' })
    Stop(): void {
    }

    @method({ inSignature: '', outSignature: '' })
    Play(): void {
    }

    @method({ inSignature: 'x', outSignature: '' })
    Seek(offset: number): void {
    }

    @method({ inSignature: 'ox', outSignature: '' })
    SetPosition(trackId: string, position: number): void {
    }
}

browser.runtime.onMessage.addListener(
    (message: any, _sender: any): boolean => {
        bus.export(`${MPRIS_PATH}/${message}`, new MPRISInterface(message));
        return true;
    });
