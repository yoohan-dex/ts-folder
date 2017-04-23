import 'jest';
import parse from '../index';

describe('parse', () => {
  it('return a ast tree', () => {

    const str =
      '<closing id="abc"><Hello re:for="{{loop}}">hello</Hello></closing>';
    expect(parse(str)).toEqual([
      {
        tagName: 'closing',
        type: 'Element',
        attributes: { id: 'abc' },
        children: [ {
          tagName: 'Hello',
          type: 'Component',
          attributes: {
            loop: 'loop',
          },
          children: [ undefined ],
        }],
      },
    ]);
  });
});
