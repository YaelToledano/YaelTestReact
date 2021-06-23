import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List.jsx';
import { AddEdit } from './AddEdit';

function Calculator({ match }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={path} component={List} />
      <Route path={`${path}/add`} component={AddEdit} />
      <Route path={`${path}/edit/:id`} component={AddEdit} />
    </Switch>
  );
}

export { Calculator };