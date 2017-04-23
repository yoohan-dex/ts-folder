import 'jest';
import lexer, {
  lexExpression,
  lexText,
  lexComment,
  lexTagAttributes,
  lexTagName,
  lexSkipTag,
  lexTag,
  lex,
} from '../lexer';


const options = {
  childlessTags: [ 'childless' ],
  closingTags: [],
  voidTags: [],
};

describe('lexEpresssion', () => {
  const str = '{{hello + world}}';
  const state = {
    str,
    options,
    cursor: 0,
    tokens: [],
  };
  it('should give a expression in curly bracket', () => {
    const tokens = lexExpression(state);
    expect(state.tokens).toEqual([ { type: 'expression', payload: 'hello + world' }]);
  });
});

describe('lexText', () => {

  it('should pass it as a text type', () => {
    const str = 'hello';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    const tokens = lexText(state);
    expect(state.tokens).toEqual([ { type: 'text', payload: 'hello' }]);
  });

  it('will pass it as a text type and a expression', () => {
    const str = 'hello{{world}}';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    const tokens = lexText(state);
    expect(state.tokens).toEqual([
      { type: 'text', payload: 'hello{{world}}' },
    ]);
  });

  it('also it can receive many many these two type of tokens', () => {
    const str = 'hello{{world}}hello{{world}}hello{{world}}hello{{world}}';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    const tokens = lexText(state);
    expect(state.tokens).toEqual([
      { type: 'text', payload: 'hello{{world}}hello{{world}}hello{{world}}hello{{world}}' },
    ]);
  });
});

describe('lexComment', () => {

  it('should pass it as a comment type', () => {
    const str = '<!--I"m a comment -->';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexComment(state);
    expect(state.tokens).toEqual([ { type: 'comment', payload: 'I"m a comment ' }]);
  });

  it('also can do it if without the comment end mark', () => {
    const str = '<!--I"m a comment lalalalalalal....';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexComment(state);
    expect(state.tokens).toEqual([ { type: 'comment', payload: 'I"m a comment lalalalalalal....' }]);
  });
});

describe('lexTagAttributes', () => {
  it('should return its attribute type', () => {
    const str = 'checked="true" />';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTagAttributes(state);
    expect(state.tokens).toEqual([ {
      type: 'attribute',
      payload: 'checked="true"',
    }]);
  });

  it('should return its attribute type even have blanks between words', () => {
    const str = 'checked pik =  hoo style ="color: \'#333\'" a />';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTagAttributes(state);
    expect(state.tokens).toEqual([ {
      type: 'attribute',
      payload: 'checked',
    }, {
      type: 'attribute',
      payload: 'pik=hoo',
    }, {
      type: 'attribute',
      payload: 'style="color: \'#333\'"',
    }, {
      type: 'attribute',
      payload: 'a',
    }]);
  });

  it('should return its all attribute type', () => {
    const str = 'checked      src="http://hello.com/img.jpeg"  href="www.baidu.com" />';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTagAttributes(state);
    expect(state.tokens).toEqual([ {
      type: 'attribute',
      payload: 'checked',
    }, {
      type: 'attribute',
      payload: 'src="http://hello.com/img.jpeg"',
    }, {
      type: 'attribute',
      payload: 'href="www.baidu.com"',
    }]);
  });
  it('should return its all attribute type even have a end tag', () => {
    const str = 'checked      src="http://hello.com/img.jpeg"  href="www.baidu.com" ';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTagAttributes(state);
    expect(state.tokens).toEqual([ {
      type: 'attribute',
      payload: 'checked',
    }, {
      type: 'attribute',
      payload: 'src="http://hello.com/img.jpeg"',
    }, {
      type: 'attribute',
      payload: 'href="www.baidu.com"',
    }]);
  });
  it('should not return its last attribute type when have no end tag and end blank', () => {
    const str = 'checked      src="http://hello.com/img.jpeg"  href="www.baidu.com"';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTagAttributes(state);
    expect(state.tokens).toEqual([ {
      type: 'attribute',
      payload: 'checked',
    }, {
      type: 'attribute',
      payload: 'src="http://hello.com/img.jpeg"',
    }]);
  });
});

describe('lexTagName', () => {
  it('should work when the tag is close', () => {
    const str = 'hello />';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    const tagName = lexTagName(state);
    expect(state.tokens).toEqual([ {
      type: 'tag',
      payload: 'hello',
    }]);
    expect(tagName).toBe('hello');
  });

  it('should work when the tag is open', () => {
    const str = 'hello>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    const tagName = lexTagName(state);
    expect(state.tokens).toEqual([ {
      type: 'tag',
      payload: 'hello',
    }]);
    expect(tagName).toBe('hello');
  });

  it('should work when the tag has many blanks', () => {
    const str = 'hello    >';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    const tagName = lexTagName(state);
    expect(state.tokens).toEqual([ {
      type: 'tag',
      payload: 'hello',
    }]);
    expect(tagName).toBe('hello');
  });
});

describe('lexSkipTag', () => {
  it('should ignore the world tag and wouldn\'t lexer the content within the childless tag', () => {
    const str = '<hello><world>lalala</world></hello>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexSkipTag('hello', state);
    expect(state.tokens).toEqual([
      { type: 'text', payload: '<hello><world>lalala</world>' },
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'hello' },
      { type: 'tag-end', close: false },
    ]);
  });
});

describe('lexTag', () => {
  it('should take the first open tag normally', () => {
    const str = '<hello><world>lalala</world></hello>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTag(state);
    expect(state.tokens).toEqual([
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'hello' },
      { type: 'tag-end', close: false },
    ]);
  });
  it('should take the first close tag normally', () => {
    const str = '</world><world></world>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTag(state);
    expect(state.tokens).toEqual([
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'world' },
      { type: 'tag-end', close: false },
    ]);
  });
  it('should take the first close tag normally', () => {
    const str = '<world /><world></world>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTag(state);
    expect(state.tokens).toEqual([
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'world' },
      { type: 'tag-end', close: true },
    ]);
  });
  it('should take the first close tag normally', () => {
    const str = '<Component /><Component></Component>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTag(state);
    expect(state.tokens).toEqual([
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'Component' },
      { type: 'tag-end', close: true },
    ]);
  });
  it('should take the tag with its attributes', () => {
    const str = '<world href="www.baidu.com" src="www.baidu.com/img.jpg" /><world></world>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lexTag(state);
    expect(state.tokens).toEqual([
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'world' },
      { type: 'attribute', payload: 'href="www.baidu.com"' },
      { type: 'attribute', payload: 'src="www.baidu.com/img.jpg"' },
      { type: 'tag-end', close: true },
    ]);
  });
});

describe('lex', () => {
  it('should pass whole the string', () => {
    const str = '<world href="www.baidu.com" src="www.baidu.com/img.jpg" />yes<!--nothing here --></world>';
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lex(state);
    expect(state.tokens).toEqual([
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'world' },
      { type: 'attribute', payload: 'href="www.baidu.com"' },
      { type: 'attribute', payload: 'src="www.baidu.com/img.jpg"' },
      { type: 'tag-end', close: true },
      { type: 'text', payload: 'yes' },
      { type: 'comment', payload: 'nothing here ' },
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'world' },
      { type: 'tag-end', close: false },
    ]);
  });
  it('should parser the childless tag\' children as text', () => {
    const str = `
      <world href="www.baidu.com" src="www.baidu.com/img.jpg" />
        yes
        <!--nothing here -->
        <childless>
          <world>I will be pass as text</world>
        </childless>
        <Component re:if="{{hello}}" />
      </world>`;
    const state = {
      str,
      options,
      cursor: 0,
      tokens: [],
    };
    lex(state);
    expect(state.tokens).toEqual([
      { type: 'text', payload: '\n      ' },
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'world' },
      { type: 'attribute', payload: 'href="www.baidu.com"' },
      { type: 'attribute', payload: 'src="www.baidu.com/img.jpg"' },
      { type: 'tag-end', close: true },
      { type: 'text', payload: '\n        yes\n        ' },
      { type: 'comment', payload: 'nothing here ' },
      { type: 'text', payload: '\n        ' },
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'childless' },
      { type: 'tag-end', close: false },
      { type: 'text', payload: '\n          <world>I will be pass as text</world>\n        ' },
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'childless' },
      { type: 'tag-end', close: false },
      { type: 'text', payload: '\n        ' },
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'Component' },
      { type: 'attribute', payload: 're:if="{{hello}}"' },
      { type: 'tag-end', close: true },
      { type: 'text', payload: '\n      ' },
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'world' },
      { type: 'tag-end', close: false },
    ]);
  });
});
describe('lexer', () => {
  it('can lexer all kinds of lex perfectly', () => {
    const str = `
      <world href="www.baidu.com" src="www.baidu.com/img.jpg" />
        yes
        <!--nothing here -->
        <childless>
          <world>I will be pass as text</world>
        </childless>
        <Component re:if="{{hello}}" />
      </world>`;
    const tokens = lexer(str, options);
    expect(tokens).toEqual([
      { type: 'text', payload: '\n      ' },
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'world' },
      { type: 'attribute', payload: 'href="www.baidu.com"' },
      { type: 'attribute', payload: 'src="www.baidu.com/img.jpg"' },
      { type: 'tag-end', close: true },
      { type: 'text', payload: '\n        yes\n        ' },
      { type: 'comment', payload: 'nothing here ' },
      { type: 'text', payload: '\n        ' },
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'childless' },
      { type: 'tag-end', close: false },
      { type: 'text', payload: '\n          <world>I will be pass as text</world>\n        ' },
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'childless' },
      { type: 'tag-end', close: false },
      { type: 'text', payload: '\n        ' },
      { type: 'tag-start', close: false },
      { type: 'tag', payload: 'Component' },
      { type: 'attribute', payload: 're:if="{{hello}}"' },
      { type: 'tag-end', close: true },
      { type: 'text', payload: '\n      ' },
      { type: 'tag-start', close: true },
      { type: 'tag', payload: 'world' },
      { type: 'tag-end', close: false },
    ]);
  });
});
