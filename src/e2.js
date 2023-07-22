// Ported/modernized for web/node from https://maxforlive.com/library/device/2816/electribe2-pattern-editor
// by Xanadu

import defpat from './e2_default_pattern.js'

const decoder = new TextDecoder()

const correctFileLength = 16640
const partOffset = 0x900
const partSize = 0x330
const sequenceOffset = 0x30

export class E2Pattern {
  constructor (pattern = defpat) {
    if (pattern.byteLength != correctFileLength) {
      throw new Error(`Incorrect Length: ${pattern.byteLength}`)
    }
    this.pattern = pattern
    this.parts = []
    for (var i = 0; i < 0x10; i++) {
      this.parts[i] = new E2Part(this.pattern, partOffset + i * partSize)
    }

    this.sequences = []
    for (var i = 0; i < 0x10; i++) {
      this.sequences[i] = new E2Sequence(this.pattern, partOffset + i * partSize + sequenceOffset)
    }
  }

  get name () {
    return decoder.decode(this.pattern.slice(0x110, 0x110 + 0x10)).replace(/\u0000/g, '').trim()
  }

  set name (s) {
    for (let i = 0; i < 0x10; i++) {
      this.pattern[0x110 + i] = s.charCodeAt(i)
    }
  }

  get bpm () { return this.pattern[0x122] + 0x100 * this.pattern[0x123] }
  set bpm (v) { this.pattern[0x123] = v >> 8; this.pattern[0x122] = v & 0xFF }
  get swing () {
    const v = this.pattern[0x124]
    return v < 100 ? v : v - 256
  }

  set swing (v) {
    this.pattern[0x124] = v < 100 ? v : v + 256
  }

  get length () { return this.pattern[0x125] }
  set length (v) { this.pattern[0x125] = v }
  get beat () { return this.pattern[0x126] }
  set beat (v) { this.pattern[0x126] = v }
  get key () { return this.pattern[0x127] }
  set key (v) { this.pattern[0x127] = v }
  get scale () { return this.pattern[0x128] }
  set scale (v) { this.pattern[0x128] = v }
  get chordset () { return this.pattern[0x129] }
  set chordset (v) { this.pattern[0x129] = v }
  get level () { return 127 - this.pattern[0x12a] }
  set level (v) { this.pattern[0x12a] = 127 - v }
  get gatearp () { return this.pattern[0x131] }
  set gatearp (v) { this.pattern[0x131] = v }
  get mfxtype () { return this.pattern[0x13d] }
  set mfxtype (v) { this.pattern[0x13d] = v }
  get alt_13_14 () { return this.pattern[0x144] }
  set alt_13_14 (v) { this.pattern[0x144] = v }
  get alt_15_16 () { return this.pattern[0x145] }
  set alt_15_16 (v) { this.pattern[0x145] = v }
}

class E2Part {
  constructor (pattern, offset) {
    this.pattern = pattern
    this.offset = offset
    this.partSize = 0x30
    this.sequenceSize = 0x300
  }

  get laststep () { return this.pattern[this.offset + 0] }
  set laststep (v) { this.pattern[this.offset + 0] = v }
  get voiceassign () { return this.pattern[this.offset + 2] }
  set voiceassign (v) { this.pattern[this.offset + 2] = v }
  get partpriority () { return this.pattern[this.offset + 3] }
  set partpriority (v) { this.pattern[this.offset + 3] = v }
  get motionseq () { return this.pattern[this.offset + 4] }
  set motionseq (v) { this.pattern[this.offset + 4] = v }
  get triggerpadvelocity () { return this.pattern[this.offset + 5] }
  set triggerpadvelocity (v) { this.pattern[this.offset + 5] = v }
  get scalemode () { return this.pattern[this.offset + 6] }
  set scalemode (v) { this.pattern[this.offset + 6] = v }
  get oscillator () { return this.pattern[this.offset + 8] + 0x100 * this.pattern[this.offset + 9] }
  set oscillator (v) {
    this.pattern[this.offset + 8] = v & 0xFF
    this.pattern[this.offset + 9] = v >> 8
  }

  get ispercussion () { return this.Oscillator <= 256 }
  get editosc () { return this.pattern[this.offset + 11] }
  set editosc (v) { this.pattern[this.offset + 11] = v }
  get filtertype () { return this.pattern[this.offset + 12] }
  set filtertype (v) { this.pattern[this.offset + 12] = v }
  get cutoff () { return this.pattern[this.offset + 13] }
  set cutoff (v) { this.pattern[this.offset + 13] = v }
  get resonance () { return this.pattern[this.offset + 14] }
  set resonance (v) { this.pattern[this.offset + 14] = v }
  get egint () { return this.pattern[this.offset + 15] }
  set egint (v) { this.pattern[this.offset + 15] = v }
  get modulation () { return this.pattern[this.offset + 16] }
  set modulation (v) { this.pattern[this.offset + 16] = v }
  get lfospeed () { return this.pattern[this.offset + 17] }
  set lfospeed (v) { this.pattern[this.offset + 17] = v }
  get lfodepth () { return this.pattern[this.offset + 18] }
  set lfodepth (v) { this.pattern[this.offset + 18] = v }
  get attack () { return this.pattern[this.offset + 20] }
  set attack (v) { this.pattern[this.offset + 20] = v }
  get decay () { return this.pattern[this.offset + 21] }
  set decay (v) { this.pattern[this.offset + 21] = v }
  get level () { return this.pattern[this.offset + 0x18] }
  set level (v) { this.pattern[this.offset + 0x18] = v }
  get pan () { return this.pattern[this.offset + 0x19] }
  set pan (v) { this.pattern[this.offset + 0x19] = v }
  get ampeg () { return this.pattern[this.offset + 0x1a] }
  set ampeg (v) { this.pattern[this.offset + 0x1a] = v }
  get mfx () { return this.pattern[this.offset + 0x1b] }
  set mfx (v) { this.pattern[this.offset + 0x1b] = v }
  get groovetype () { return this.pattern[this.offset + 0x1c] }
  set groovetype (v) { this.pattern[this.offset + 0x1c] = v }
  get groovedepth () { return this.pattern[this.offset + 0x1d] }
  set groovedepth (v) { this.pattern[this.offset + 0x1d] = v }
  get ifx () { return this.pattern[this.offset + 0x20] }
  set ifx (v) { this.pattern[this.offset + 0x20] = v }
  get fx () { return this.pattern[this.offset + 0x21] }
  set fx (v) { this.pattern[this.offset + 0x21] = v }
  get insertfxamount () { return this.pattern[this.offset + 0x22] }
  set insertfxamount (v) { this.pattern[this.offset + 0x22] = v }
  get pitch () { return this.pattern[this.offset + 0x24] }
  set pitch (v) { this.pattern[this.offset + 0x24] = v }
  get glide () { return this.pattern[this.offset + 0x25] }
  set glide (v) { this.pattern[this.offset + 0x25] = v }
}

class E2Sequence {
  constructor (pattern, offset) {
    const stepSize = 12

    this.pattern = pattern
    this.offset = offset
    this.sequenceSize = 0x300

    this.bars = []
    this.steps = []

    for (let b = 0; b < 4; b++) {
      this.bars[b] = []

      for (let s = 0; s < 16; s++) {
        const step = new E2Step(this.pattern, this.offset + (b * 16 + s) * stepSize)
        this.bars[b][s] = step
        this.steps[b * 16 + s] = step
      }
    }
  }
}

class E2Step {
  constructor (pattern, offset) {
    this.pattern = pattern
    this.offset = offset
    this.size = 12
  }

  get hasNotes () { return this.pattern[this.offset + 0] }
  get gate () { return this.pattern[this.offset + 1] & 0x7F }
  set gate (v) {
    if (v > 96 || v < 0) {
      v = 255
    }
    this.pattern[this.offset + 1] = v
  }

  get velocity () { return this.pattern[this.offset + 2] }
  set velocity (v) { this.pattern[this.offset + 2] = v }
  get chord () { return this.pattern[this.offset + 3] }
  get note1 () { return this.pattern[this.offset + 4] - 1 }
  get note2 () { return this.pattern[this.offset + 5] - 1 }
  get note3 () { return this.pattern[this.offset + 6] - 1 }
  get note4 () { return this.pattern[this.offset + 7] - 1 }
  get notes () {
    const n = []
    n[0] = this.pattern[this.offset + 4] - 1
    n[1] = this.pattern[this.offset + 5] - 1
    n[2] = this.pattern[this.offset + 6] - 1
    n[3] = this.pattern[this.offset + 7] - 1
    return n
  }

  hasNote (noteNr) {
    const n = noteNr + 1
    if (this.pattern[this.offset + 4] == n ||
        this.pattern[this.offset + 5] == n ||
        this.pattern[this.offset + 6] == n ||
        this.pattern[this.offset + 7] == n) {
      return 1
    }
    return 0
  }

  handleNote (noteNr) {
    const n = noteNr + 1
    if (this.pattern[this.offset + 4] == n) {
      this.pattern[this.offset + 4] = this.pattern[this.offset + 5]
      this.pattern[this.offset + 5] = this.pattern[this.offset + 6]
      this.pattern[this.offset + 6] = this.pattern[this.offset + 7]
      this.pattern[this.offset + 7] = 0

      // HasNotes flag
      if (this.pattern[this.offset + 4] == 0) {
        this.pattern[this.offset + 0] = 0
      }

      return -1
    } else if (this.pattern[this.offset + 5] == n) {
      this.pattern[this.offset + 5] = this.pattern[this.offset + 6]
      this.pattern[this.offset + 6] = this.pattern[this.offset + 7]
      this.pattern[this.offset + 7] = 0
      return -1
    } else if (this.pattern[this.offset + 6] == n) {
      this.pattern[this.offset + 6] = this.pattern[this.offset + 7]
      this.pattern[this.offset + 7] = 0
      return -1
    } else if (this.pattern[this.offset + 7] == n) {
      this.pattern[this.offset + 7] = 0
      return -1
    } else if (this.pattern[this.offset + 4] == 0 || this.pattern[this.offset + 4] > n) {
      var ret = this.pattern[this.offset + 7] - 1
      this.pattern[this.offset + 7] = this.pattern[this.offset + 6]
      this.pattern[this.offset + 6] = this.pattern[this.offset + 5]
      this.pattern[this.offset + 5] = this.pattern[this.offset + 4]
      this.pattern[this.offset + 4] = n
      // HasNotes flag
      this.pattern[this.offset + 0] = 1
      return ret
    } else if (this.pattern[this.offset + 5] == 0 || this.pattern[this.offset + 5] > n) {
      var ret = this.pattern[this.offset + 7] - 1
      this.pattern[this.offset + 7] = this.pattern[this.offset + 6]
      this.pattern[this.offset + 6] = this.pattern[this.offset + 5]
      this.pattern[this.offset + 5] = n
      return ret
    } else if (this.pattern[this.offset + 6] == 0 || this.pattern[this.offset + 6] > n) {
      var ret = this.pattern[this.offset + 7] - 1
      this.pattern[this.offset + 7] = this.pattern[this.offset + 6]
      this.pattern[this.offset + 6] = n
      return ret
    } else {
      var ret = this.pattern[this.offset + 7] - 1
      this.pattern[this.offset + 7] = n
      return ret
    }
  }
}
