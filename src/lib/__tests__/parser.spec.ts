import 'jest';
import lexer from '../lexer';
import parser from '../parser';

const options = {
  childlessTags: [ 'childless' ],
  closingTags: [ 'closing' ],
  voidTags: [ 'void' ],
  loopTag: 'string',
  componentTags: [],
  format: () => 'ss',
};
describe('parser', () => {
  it('should parse the string and return tokens', () => {

    const str = '<hello></hello>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    let tokens = lexer(str, options);
    const nodes = parser(tokens, options);
    expect(nodes).toEqual([ {
      type: 'element',
      tagName: 'hello',
      children: [],
      attributes: [],
    }]);

  });

  it('can handle the childless element', () => {

    const str = '<childless><hello>hello</hello></childless>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    let tokens = lexer(str, options);
    const nodes = parser(tokens, options);
    expect(nodes).toEqual([ {
      type: 'element',
      tagName: 'childless',
      children: [ {
        type: 'text',
        content: '<hello>hello</hello>',
      }],
      attributes: [],
    }]);

  });

  it('should can handle the closing element return some children', () => {

    const str = '<closing><hello>hello</hello></closing>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    let tokens = lexer(str, options);
    const nodes = parser(tokens, options);
    expect(nodes).toEqual([ {
      type: 'element',
      tagName: 'closing',
      children: [ {
        type: 'element',
        tagName: 'hello',
        attributes: [],
        children: [ {
          type: 'text',
          content: 'hello',
        }],
      }],
      attributes: [],
    }]);

  });

  it('should can handle the attributes', () => {

    const str = '<closing r:if="{{val}}" r:for="{{array}}"><hello src="https://www.baidu.com">hello</hello></closing>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    let tokens = lexer(str, options);
    const nodes = parser(tokens, options);
    expect(nodes).toEqual([ {
      type: 'element',
      tagName: 'closing',
      attributes: [
        [ 'r:if', '{{val}}' ],
        [ 'r:for', '{{array}}' ],
      ],
      children: [ {
        type: 'element',
        tagName: 'hello',
        attributes: [
          [ 'src', 'https://www.baidu.com' ],
        ],
        children: [ {
          type: 'text',
          content: 'hello',
        }],
      }],
    }]);

  });
});
