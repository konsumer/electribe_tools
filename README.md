This is a collection of electribe2 tools written in javascript, for the web.

For each tool, nothing is sent to or stored on a server (it's  all in your browser.)

## Pattern Manager

This is baed on [e2allpat](https://github.com/bangcorrupt/e2allpat).

- Submit allpat file and receive zip archive of patterns + global settings backup.
- Submit zip archive of patterns + global settings backup and receive allpat file.
- Zip must contain at least 250 pattern files and 1 global settings backup.
- Get global settings backup file by submitting allpat file.
- First 250 patterns will be added to allpat file in alphanumeric order by filename.
- Re-order and rename patterns by editing filenames.
- Filenames must retain 4 character 'nnn_' prefix for patterns to be named correctly.
