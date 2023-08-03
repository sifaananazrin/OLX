import React from 'react';
import Signup from '../Components/Signup/Signup';
import { Loading } from '../Store/Context';

function SignupPage() {
  return (
    <div>
      <Loading>
        <Signup />
      </Loading>
    </div>
  );
}

export default SignupPage;
