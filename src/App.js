// import { useState } from 'react';
import { useImmer } from "use-immer";
import * as EmailValidator from 'email-validator';
import { passwordStrength } from 'check-password-strength';
import './App.css';


function App() {

  const [state, setState] = useImmer({
    user: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
    showInvalidEmail: false,
    isPasswordShort: false,
    passwordStrength: {
      color: '',
      value: ''
    }
  });


const validate = 
  (
    state.user
    && !state.showInvalidEmail
    && state.password.length > 8
    && state.passwordStrength.value === 'Strong'
  );

  return (
    <div id="app" className="container">
      <form id="my-form" className="shadow">
        <h4>Form Validator</h4>

        <div className="mb-4">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            data-rules="required|digits:5|min:5"
            placeholder='Enter email'
            value={state?.user || ''}
            onChange={(event) => {
              setState((draft) => {
                draft.user = event.target.value;
              })
            }}
            onBlur={ ()=> {
              setState((draft) => {
                draft.showInvalidEmail = !EmailValidator.validate(state?.user);
              });
            }
            }
          />
          {
            state.showInvalidEmail 
            &&
            <p className="validator-err">Please correct your email</p>
          }
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            className="form-control"
            type={state.showPassword ? 'text' : 'password'}
            data-rules="required|string|min:5"
            value={state.password || ''}
            onChange={(event) => {
              setState((draft) => {
                draft.password = event.target.value;
                if (event.target.value.length > 8) {
                  const passwordStrengthValue = passwordStrength(event.target.value).value;
                  console.log(passwordStrengthValue);
                  draft.passwordStrength.value = passwordStrengthValue;
                  switch (passwordStrengthValue) {
                    case'Too weak':
                      draft.passwordStrength.color ='red';                      
                      break;
                    case'Weak':
                      draft.passwordStrength.color ='orange';                      
                      break;
                    case'Medium':
                      draft.passwordStrength.color ='yellow';                      
                      break;                  
                    default:
                      draft.passwordStrength.color ='green'; 
                      break;
                  }
                  draft.isPasswordShort = false;  
                } else {
                  draft.passwordStrength.value = '';
                  draft.passwordStrength.color ='';
                }
              })
            }}
            onBlur={ ()=> {
              setState((draft) => {
                draft.isPasswordShort = state.password.length < 8;  
              });
            }
            }
          />
          {
            state.isPasswordShort
            &&
            <p className="validator-err">Password must be at least 8 characters long</p>
          }
          {
            state.password 
            &&
            <button 
              type="button"
              onClick={() => {
                setState((draft) => {
                  draft.showPassword = !state.showPassword;                
                })
              }}
              className="btn btn-secondary">
              Show PWD
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"></path>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"></path>
              </svg>
            </button>
          }
        </div>
        {
          !state.showPassword
          && 
          <div className="mb-4">
            <label>Password Confirmation</label>
            <input
              className="form-control"
              type="text"
              data-rules="required|string|min:5"
              value={state.confirmPassword || ''}
              onChange={(event) => {
                setState((draft) => {
                  draft.confirmPassword = event.target.value;
                })
              }}
            />
          </div>
        }
        <div 
          className="mb-4"
          style={{
            color: state.passwordStrength.color
          }}>
            {state.passwordStrength.value}
        </div>
        <button
          disabled={validate}
          style={{
            backgroundColor: validate ? '' : 'gray'
          }}
        >
          Create User
        </button>
      </form>
    </div>
  );
}

export default App;
