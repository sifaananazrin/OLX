import React, { Fragment } from 'react';
import Header from '../Components/Header/Header';
import Create from '../Components/Create/Create';
import { Loading } from '../Store/Context';

const CreatePage = () => {
  return (
    <Loading>
      <Fragment>
        <Header />
        <Create />
      </Fragment>
    </Loading>
  );
};

export default CreatePage;
