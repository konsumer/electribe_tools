This is a collection of electribe2 tools written in javascript, for the web.

For each tool, nothing is sent to or stored on a server (it's  all in your browser.)

## Pattern Manager

This is baed on code from [electribe2-pattern-editor](https://maxforlive.com/library/device/2816/electribe2-pattern-editor) and [e2allpat](https://github.com/bangcorrupt/e2allpat).

- Submit allpat file and receive zip archive of patterns + global settings backup.
- Submit zip archive of patterns + global settings backup and receive allpat file.
- Zip must contain at least 250 pattern files and 1 global settings backup.
- Get global settings backup file by submitting allpat file.
- First 250 patterns will be added to allpat file in alphanumeric order by filename.
- Re-order and rename patterns by editing filenames.
- Filenames must retain 4 character 'nnn_' prefix for patterns to be named correctly.

### TODO

- pattern-editing
- global settings. still haven't worked this out.
- Instrument-mapping, like change all the references to instrument 1 to instrument 50.
- Allow saving an instrument-map, so if you install hacktribe, you can setup your map once, and have it work for stock patterns, with all the stock samplers starting at some other number.
- send to device via sysex (using [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API))
- play on device via sysex (using [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API))
