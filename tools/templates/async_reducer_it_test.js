
  it('should handle ${BEGIN_ACTION_TYPE}', () => {
    const prevState = { ${ACTION_NAME}Pending: true };
    const state = reducer(
      prevState,
      { type: ${BEGIN_ACTION_TYPE} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.${ACTION_NAME}Pending).to.be.true;
  });

  it('should handle ${SUCCESS_ACTION_TYPE}', () => {
    const prevState = { ${ACTION_NAME}Pending: true };
    const state = reducer(
      prevState,
      { type: ${SUCCESS_ACTION_TYPE}, data: {} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.${ACTION_NAME}Pending).to.be.false;
  });

  it('should handle ${FAILURE_ACTION_TYPE}', () => {
    const prevState = { ${ACTION_NAME}Pending: true };
    const state = reducer(
      prevState,
      { type: ${FAILURE_ACTION_TYPE}, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState);
    expect(state.${ACTION_NAME}Pending).to.be.false;
    expect(state.${ACTION_NAME}Error).to.exist;
  });

  it('should handle ${DISMISS_ERROR_ACTION_TYPE}', () => {
    const prevState = { ${ACTION_NAME}Error: new Error('some error') };
    const state = reducer(
      prevState,
      { type: ${DISMISS_ERROR_ACTION_TYPE} }
    );
    expect(state).to.not.equal(prevState);
    expect(state.${ACTION_NAME}Error).to.be.null;
  });