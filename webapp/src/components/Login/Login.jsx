import React from 'react';
import {Button} from '@mantine/core';
function Login() {
  return (
    <div className='App'>
        <header className='App-header'>
        <Button color="green">
            <a href='/auth/login'>
                Login with Spotify
            </a>
        </Button>
        </header>
    </div>
  )
}

export default Login