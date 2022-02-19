import { chiaroscuro } from './chiaroscuro';

describe('chiaroscuro Theme', () => {
  it('should match the snapshot', () => {
    expect(chiaroscuro).toMatchSnapshot();
  });
});
