import 'jest';
import lexer from '../lexer';
import parser from '../parser';
import format, { splitHead, unquote, unCurly } from '../format';
const options = {
  childlessTags: [ 'childless' ],
  closingTags: [ 'closing' ],
  voidTags: [ 'void' ],
  componentTags: [],
};

describe('piece function', () => {
  it('should spilt the string as expected', () => {
    const str = '333=333';
    expect(splitHead(str, '=')).toEqual([ '333', '333' ]);
  });
  it('should spilt the string and return [string, ""] if without right pair', () => {
    const str = '333';
    expect(splitHead(str, '=')).toEqual([ '333', '' ]);
  });

  it('should unquote the string', () => {
    const strA = '"hello"';
    const strB = "'hello'";
    expect(unquote(strA)).toBe('hello');
    expect(unquote(strB)).toBe('hello');
  });

  it('should take away the couple of curly bracket', () => {
    const str = '{{haha}}';
    expect(unCurly(str)).toBe('haha');
  })
})
describe('format', () => {
  it('should can format the string perfectly', () => {

    const str = '<closing style="background-color: #333;" class="heloo hhh"><Hello src="https://www.baidu.com">hello</Hello></closing>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    let tokens = lexer(str, options);
    const nodes = parser(tokens, options);
    const result = format(nodes);
    expect(result).toEqual([
      {
        tagName: 'closing',
        type: 'Element',
        attributes: {
          className: [ 'heloo', 'hhh' ],
          styles: {
            backgroundColor: '#333',
          },
        },
        children: [ {
          tagName: 'Hello',
          type: 'Component',
          attributes: {
            src: 'https://www.baidu.com',
          },
          children: [undefined],
        }],
      },
    ]);
  });

  it('should can format the some attribute like if and for', () => {

    const str =
    '<closing style="background-color: {{primary}}" re:if="{{isRight}}"><Hello re:for="{{loop}}">hello</Hello></closing>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    let tokens = lexer(str, options);
    const nodes = parser(tokens, options);
    const result = format(nodes);
    expect(result).toEqual([
      {
        tagName: 'closing',
        type: 'Element',
        attributes: {
          condition: 'isRight',
          styles: {
            backgroundColor: '{{primary}}',
          },
        },
        children: [ {
          tagName: 'Hello',
          type: 'Component',
          attributes: {
            loop: 'loop',
          },
          children: [undefined],
        }],
      },
    ]);
  });

});
