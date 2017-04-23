import 'jest';
import parse from '../index';
const options = {
  childlessTags: [ 'childless' ],
  closingTags: [],
  voidTags: [],
};
describe('parse', () => {
  it('return a ast tree', () => {

    const str =
      '<closing id="abc"><Hello re:for="{{loop}}">hello</Hello></closing>';
    expect(parse(str)).toEqual([
      {
        tagName: 'closing',
        type: 'Element',
        attributes: {},
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

  it('can accept custom options', () => {

    const str =
      '<closing id="abc"><Hello re:for="{{loop}}">hello</Hello></closing>';
    expect(parse(str, options)).toEqual([
      {
        tagName: 'closing',
        type: 'Element',
        attributes: {},
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
