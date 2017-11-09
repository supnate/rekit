import { expect } from 'chai';
import { ${_.camelCase(name)} } from 'src/features/${_.kebabCase(feature)}/selectors/${_.camelCase(name)}';

describe('${_.kebabCase(feature)}/selectors/${_.camelCase(name)}', () => {
  it('returns correct value', () => {
    const expectedResult = 'data';
    expect(${_.camelCase(name)}({ data: 'data' })).to.equal(expectedResult);
  });
});
