const preValidationRegex = /^[a-gA-Gz',_^/2-9 ]*$/;
const maxLength = 100;
const maxPitches = 10;
const pitchRange = [-14, 21];

export function validateABCSize(abc) {
  return abc.length <= maxLength;
}

export function validateABCChars(abc) {
  return preValidationRegex.test(abc);
}

export function validateABC(abc) {
  let checks = {};
  checks.size = validateABCSize(abc);
  checks.chars = validateABCChars(abc);
  let valid = true;
  for (const p in checks) {
    if (!checks[p]) {
      valid = false;
      break;
    }
  }
  checks.valid = valid;
  return checks;
}

export function validateDuration(tunes) {
  const voice = tunes[0].lines[0].staff[0].voices[0];
  let totalDuration = 0;
  for (const element of voice) {
    if (element.el_type == "note") {
      totalDuration += element.duration;
    }
  }
  return Math.abs(totalDuration - 1) <= 0.001;
}

export function validatePitches(tunes) {
  const voice = tunes[0].lines[0].staff[0].voices[0];
  for (const element of voice) {
    if (element.el_type == "note") {
      for (const pitch of element.pitches || []) {
        if (pitch.pitch < pitchRange[0] || pitch.pitch > pitchRange[1]) {
          return false;
        }
      }
    }
  }
  return true;
}

export function validateChords(tunes) {
  const voice = tunes[0].lines[0].staff[0].voices[0];
  for (const element of voice) {
    if (element.el_type == "note") {
      if (element.pitches && element.pitches.length > maxPitches) {
        return false;
      }
    }
  }
  return true;
}

export function validateStructure(tunes) {
  if (!tunes) {
    return false;
  }

  if (tunes.length != 1) {
    return false;
  }
  const tune = tunes[0];
  if (tune.lines.length != 1) {
    return false;
  }
  const line = tune.lines[0];
  if (line.staff.length != 1) {
    return false;
  }
  const staff = line.staff[0];

  if (staff.key.accidentals.length != 0) {
    return false;
  }
  if (staff.voices.length != 1) {
    return false;
  }

  return true;
}

export function validateTunes(tunes) {
  let checks = {};
  checks.structure = validateStructure(tunes);
  if (checks.structure) {
    checks.duration = validateDuration(tunes);
    checks.pitches = validatePitches(tunes);
    checks.chords = validateChords(tunes);
  }

  let valid = true;
  for (const p in checks) {
    if (!checks[p]) {
      valid = false;
      break;
    }
  }
  checks.valid = valid;

  return checks;
}

export function decorateBarABC(abc) {
  return ["%%printtempo false\nM: 4/4\nQ:1/4=140\nM: 4/4\n", abc, "|"].join("");
}

export const placeholderBarABC = "z8";

export function getValidationErrorMessage(abcChecks, tuneChecks) {
  if (!abcChecks.size) {
    return "Input too long";
  }
  if (!abcChecks.chars) {
    return "Input contains invalid characters";
  }
  if (!tuneChecks.structure) {
    return "Unexpected error";
  }
  if (!tuneChecks.duration) {
    return "Bar is too long or too short";
  }
  if (!tuneChecks.pitches) {
    return "Bar contains pitches outside of the allowed range";
  }
  if (!tuneChecks.chords) {
    return "Bar contains coords";
  }
  return null;
}
