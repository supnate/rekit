
  it('${ACTION_NAME} success', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: ${BEGIN_ACTION_TYPE} },
      { type: ${SUCCESS_ACTION_TYPE}, data: {} },
    ];

    return store.dispatch(${ACTION_NAME}({ error: false }))
      .then(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('${ACTION_NAME} failure', () => {
    const store = mockStore({});

    const expectedActions = [
      { type: ${BEGIN_ACTION_TYPE} },
      { type: ${FAILURE_ACTION_TYPE}, data: { error: 'some error' } },
    ];

    return store.dispatch(${ACTION_NAME}({ error: true }))
      .catch(() => {
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
  });

  it('dismiss${PASCAL_ACTION_NAME}Error', () => {
    const expectedAction = {
      type: ${DISMISS_ERROR_ACTION_TYPE},
    };
    expect(dismiss${PASCAL_ACTION_NAME}Error()).to.deep.equal(expectedAction);
  });