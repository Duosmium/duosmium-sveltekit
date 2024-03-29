export const DUOSMIUM_ID_REGEX_STRING =
	'(19|20)\\d{2}-[01]\\d-[0-3]\\d_([\\w]+_invitational|([ns]?[A-Z]{2})_[\\w]+_regional|([ns]?[A-Z]{2})_states|nationals)_(no_builds_)?[abc]';
export const DUOSMIUM_ID_REGEX = new RegExp(DUOSMIUM_ID_REGEX_STRING);
export const JSON_OPTIONS: object = { headers: { 'content-type': 'application/json' } };
export const YAML_OPTIONS: object = {
	headers: {
		'content-type': 'text/yaml',
		'content-disposition': 'attachment; filename=placeholder.yaml'
	}
};
export const STATES_BY_POSTAL_CODE: object = {
	AL: 'Alabama',
	AK: 'Alaska',
	AZ: 'Arizona',
	AR: 'Arkansas',
	CA: 'California',
	nCA: 'Northern California',
	sCA: 'Southern California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DE: 'Delaware',
	DC: 'District of Columbia',
	FL: 'Florida',
	GA: 'Georgia',
	HI: 'Hawaii',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	IA: 'Iowa',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	ME: 'Maine',
	MD: 'Maryland',
	MA: 'Massachusetts',
	MI: 'Michigan',
	MN: 'Minnesota',
	MS: 'Mississippi',
	MO: 'Missouri',
	MT: 'Montana',
	NE: 'Nebraska',
	NV: 'Nevada',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NY: 'New York',
	NC: 'North Carolina',
	ND: 'North Dakota',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TX: 'Texas',
	UT: 'Utah',
	VT: 'Vermont',
	VA: 'Virginia',
	WA: 'Washington',
	WV: 'West Virginia',
	WI: 'Wisconsin',
	WY: 'Wyoming'
};
// from https://stackoverflow.com/questions/13627308/
export const ordinalize = (i: number) => {
	const j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + 'st';
	}
	if (j == 2 && k != 12) {
		return i + 'nd';
	}
	if (j == 3 && k != 13) {
		return i + 'rd';
	}
	return i + 'th';
};
