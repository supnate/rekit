/* eslint no-restricted-globals: 0, prefer-spread: 0, no-continue: 0, no-use-before-define: 0 */
/* global self, babylon */
self.Prism = { disableWorkerMessageHandler: true };
self.importScripts(['/static/libs/prism-1.14.0.js']);

function getLineNumberAndOffset(start, lines) {
  let line = 0;
  let offset = 0;
  while (offset + lines[line] < start) {
    offset += lines[line] + 1;
    line += 1;
  }

  return { line: line + 1, offset };
}

function tagType(token) {
  try {
    if (token.content[0].content[0].content === '</') return 'end';
  } catch (e) {}

  const last = token.content[token.content.length - 1];
  if (last.content === '>') return 'start';
  if (last.content === '/>') return 'self-close';
  return null;
}

function findEndTagIndex(startIndex, tokens) {
  let depth = 1;
  for (let i = startIndex; i < tokens.length; i += 1) {
    if (tokens[i].type !== 'tag') continue;
    const tt = tagType(tokens[i]);
    if (tt === 'start') depth += 1;
    if (tt === 'end') depth -= 1;
    if (depth === 0) return i;
  }

  return startIndex;
}

function findJsxText(tokens, startIndex) {
  let jsxDepth = 0;
  let jsxExpDepth = 0;
  let jsxTextToken = null;
  let result = [];
  for (let i = startIndex; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'tag') {
      const tt = tagType(t);
      if (tt === 'start') {
        if (jsxDepth > 0) {
          // Find jsx text in sub tag
          result = [...result, ...findJsxText(tokens, i)];
          jsxTextToken = { content: '', type: 'jsx-text', length: 0 };
          result.push(jsxTextToken);
          i = findEndTagIndex(i + 1, tokens);
          continue; // eslint-disable-line
        }
        const tagTokens = flattenTagToken(t); // flatten tokens for a tag
        result = [...result, ...tagTokens];
        jsxDepth += 1;
        jsxTextToken = { content: '', type: 'jsx-text', length: 0 };
        result.push(jsxTextToken);
      }
      if (tt === 'end') {
        const tagTokens = flattenTagToken(t); // flatten tokens for a tag
        result = [...result, ...tagTokens];
        jsxDepth -= 1;
        if (jsxDepth < 0) jsxDepth = 0;

        if (jsxDepth === 0) jsxTextToken = null;
        else {
          jsxTextToken = { content: '', type: 'jsx-text', length: 0 };
          result.push(jsxTextToken);
        }
        if (startIndex > 0) return result;
      }
      if (tt === 'self-close') {
        const tagTokens = flattenTagToken(t); // flatten tokens for a tag
        result = [...result, ...tagTokens];
        if (jsxDepth > 0) {
          jsxTextToken = { content: '', type: 'jsx-text', length: 0 };
          result.push(jsxTextToken);
        }
      }
      continue; // eslint-disable-line
    }

    // Find jsx expression
    if (t.content === '{') {
      jsxExpDepth += 1;
      if (jsxExpDepth === 1) {
        result.push({
          ...t,
          type: 'jsx-exp-start',
        });
        jsxTextToken = null;
        continue; // eslint-disable-line
      }
    }

    if (t.content === '}' && jsxExpDepth > 0) {
      jsxExpDepth -= 1;
      if (jsxExpDepth < 0) {
        jsxExpDepth = 0;
      }
      if (jsxExpDepth === 0) {
        result.push({
          ...t,
          type: 'jsx-exp-end',
        });

        if (jsxDepth > 0) {
          jsxTextToken = { content: '', type: 'jsx-text', length: 0 };
          result.push(jsxTextToken);
        }
        continue; // eslint-disable-line
      }
    }

    if (jsxTextToken) {
      jsxTextToken.length += t.length;
      jsxTextToken.content += typeof t === 'string' ? t : t.content;
    } else {
      result.push(t);
    }
  }
  return result;
}

function flattenTagToken(token) {
  if (!Array.isArray(token.content)) return [token];

  const isEndTag = token.content[0].content[0].content === '</';
  if (isEndTag) {
    return [
      {
        type: 'end-tag-start',
        content: '</',
        length: 2,
      },
      {
        type: 'end-tag-name',
        content: token.content[0].content[1],
        length: token.content[0].content[1].length,
      },
      ...token.content.slice(1, token.content.length - 1),
      {
        type: 'end-tag-end',
        content: '>',
        length: 1,
      },
    ];
  }

  let arr = [...token.content];
  const result = [];
  while (arr.length) {
    const t = arr.shift();
    if (/attr-name|attr-value/.test(t.type)) result.push(t);
    else if (/spread/.test(t.type)) {
      result.push({
        ...t.content[0],
        type: 'jsx-exp-start',
      });
      result.push.apply(result, t.content.slice(1, t.content.length - 1));
      result.push({
        ...t.content[t.content.length - 1],
        type: 'jsx-exp-end',
      });
    } else if (t.type === 'script') {
      const i = t.content.findIndex(c => c.content === '{');
      result.push.apply(result, [
        ...t.content.slice(0, i),
        {
          ...t.content[i],
          type: 'jsx-exp-start',
        },
        ...t.content.slice(i + 1, t.content.length - 1),
        // ...findJsxText(t.content.slice(i + 1, t.content.length - 1), 0),
        {
          ...t.content[t.content.length - 1],
          type: 'jsx-exp-end',
        },
      ]);
    } else if (Array.isArray(t.content)) arr = [...t.content, ...arr];
    else result.push(t);
  }
  result[0].type = 'tag-start';
  result[1] = {
    type: 'start-tag-name',
    length: result[1].length,
    content: result[1],
  };
  result[result.length - 1].type = 'tag-end';
  return result;
}

function flattenTokens(tokens) {
  return tokens.reduce((prev, token) => {
    if (token.type === 'tag') prev.push.apply(prev, flattenTagToken(token));
    else prev.push(token);
    return prev;
  }, []);
}

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { code } = event.data;
  try {
    let tokens = Prism.tokenize(code, Prism.languages.jsx);
    const env = {
      code,
      grammar: Prism.languages.jsx,
      language: 'javascript',
      tokens,
    };
    Prism.hooks.run('after-tokenize', env);
    tokens = flattenTokens(tokens);

    const classifications = [];
    let pos = 0;
    const lines = code.split('\n').map(line => line.length);
    tokens.forEach(token => {
      if (typeof token === 'string') {
        if (token === 'console') {
          token = {
            content: 'console',
            type: 'globals',
            length: 7,
          };
        } else {
          pos += token.length;
          return;
        }
      }

      const { offset: startOffset, line: startLine } = getLineNumberAndOffset(pos, lines);
      const { offset: endOffset, line: endLine } = getLineNumberAndOffset(pos + token.length, lines);
      let kind = token.type;
      if (kind === 'keyword') kind = `${token.content}-keyword`;
      if (token.content === 'constructor' && token.type === 'function') kind = 'constructor-keyword';
      if (token.content === '=>') kind = 'arrow-operator';
      classifications.push({
        start: pos + 1 - startOffset,
        end: pos + 1 + token.length - endOffset,
        kind,
        startLine,
        endLine,
      });
      pos += token.length;
    });
    self.postMessage({ classifications });
  } catch (e) {
    /* Ignore error */
    console.log('exp:', e);
  }
});
