type ConjugationRule = [RegExp, string];

const pastTenseRules: ConjugationRule[] = [
  [/e$/i, 'ed'], // 'create' => 'created'
  [/ind$/i, 'ound'], // 'find' => 'found'
  [/$/, 'ed'], // 'process' => 'processed'
];

const pluralIrregularWords: Record<string, string> = {
  child: 'children',
  person: 'people',
};

const pluralRules: ConjugationRule[] = [
  [/([^aeiouy])y$/i, '$1ies'], // 'winery' => 'wineries'
  [/([^aeiouy]o)$/i, '$1es'], // 'halo' => 'haloes'
  [/(ss|[xz]|[cs]h)$/i, '$1es'], // 'torch' => 'torches'
  [/s$/i, 's'], // 'words' => 'words'
  [/$/, 's'], // 'word' => 'words'
];

const singularIrregularWords: Record<string, string> =
  Object.fromEntries(
    Object
    .entries(pluralIrregularWords)
    .map((tuple: [string, string]): [string, string] => ([tuple[1], tuple[0]]))
  );

const singularRules: ConjugationRule[] = [
  [/([^aeiouy])ies$/i, '$1y'], // 'wineries' => 'winery'
  [/([^aeiouy]o)es$/, '$1'], // 'haloes' => 'halo'
  [/(ss|[sxz]|[cs]h)es$/, '$1'], // 'torches' => 'torch'
  [/ss$/i, 'ss'], // 'truss' => 'truss'
  [/s$/i, ''], // 'words' => 'word'
];

const uncountableWords: Record<string, true> = {
  data: true,
};

export const pastTense = (word: string): string => {
  if (word === undefined || word === null || word === '') { return ''; }

  return pastTenseRules.reduce(
    (memo: string, rule: ConjugationRule): string => {
      const [rxp, str] = rule;

      if (memo.length > 0) { return memo; }

      if (word.match(rxp)) { return word.replace(rxp, str); }

      return '';
    },
    '',
  );
};

export const pluralize = (word: string): string => {
  if (word === undefined || word === null || word === '') { return ''; }

  if (word in pluralIrregularWords) { return pluralIrregularWords[word]; }

  if (word in singularIrregularWords) { return word; }

  if (word in uncountableWords) { return word; }

  return pluralRules.reduce(
    (memo: string, rule: ConjugationRule): string => {
      const [rxp, str] = rule;

      if (memo.length > 0) { return memo; }

      if (word.match(rxp)) { return word.replace(rxp, str); }

      return '';
    },
    '',
  );
};

export const singularize = (word: string): string => {
  if (word === undefined || word === null || word === '') { return ''; }

  if (word in singularIrregularWords) { return singularIrregularWords[word]; }

  if (word in pluralIrregularWords) { return word; }

  if (word in uncountableWords) { return word; }

  const singular = singularRules.reduce(
    (memo: string, rule: ConjugationRule): string => {
      const [rxp, str] = rule;

      if (memo.length > 0) { return memo; }

      if (word.match(rxp)) { return word.replace(rxp, str); }

      return '';
    },
    '',
  );

  return singular.length > 0 ? singular : word;
};
