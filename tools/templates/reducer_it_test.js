
  it('should handle ${ACTION_TYPE}', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: ${ACTION_TYPE} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state).to.deep.equal(prevState); // TODO: replace this line with real case.
  });