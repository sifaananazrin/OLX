import React from 'react';
import Login from '../Components/Login/Login';
import { Loading } from '../Store/Context';

function LoginPage() {
  return (
    <div>
      <Loading>
        <Login />
      </Loading>
    </div>
  );
}

export default LoginPage;
