export const applyWildcards = ({
  url,
  wildcards,
}: {
  url: string,
  wildcards: Record<string, string>,
}): string => {
  if (!url) { return ''; }

  return url
    .split('/')
    .map((segment: string): string => {
      if (segment[0] !== ':') { return segment; }

      const key = segment.slice(1);

      if (wildcards && key in wildcards) { return wildcards[key]; }

      const validKeys = wildcards ?
        Object.keys(wildcards).map((str: string): string => `:${str}`) :
        [];
      let message = `invalid wildcard ":${key}" in url "${url}"`;

      if (validKeys.length > 0) {
        message = `${message} - valid keys are ${validKeys.join(', ')}`;
      }

      console.log(`[ERROR] API Utils applyWildcards() ${message}`);

      throw new Error(message);
    })
    .join('/');
};
