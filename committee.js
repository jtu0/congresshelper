// ProPublica uses names instead of IDs for its committees
// It does not use the same name for the same committee
// Strip out common words to create a canoncial committee name
export var committee_canonical_name = (name) => {
  name = name.trim();
  name = name.replace(/^(house|senate)\s+/i, '');
  name = name.replace(/^committee\s+on\s+(the\s+)?/i, '');
  name = name.replace(/\s+committee$/i, '');
  return name;
}
