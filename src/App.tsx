import './App.css';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMachine } from '@xstate/react';
import FormMachine, { UserSubmitForm } from './fsm';

const App: React.FC = () => {
  const [state, send] = useMachine(FormMachine)
  console.log('state currently,',state.value)

  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required'),
    username: Yup.string()
      .required('Username is required')
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required')
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  // const onSubmit = (data: UserSubmitForm) => {
  //   // console.log(JSON.stringify(data, null, 2));
  //   send({type: 'REGISTER', data: data})
  // };

  const onSubmit = (event: any) => {
    event.preventDefault()
     send({type: 'REGISTER'})
  }

  return (
    <div className="register-form">
      <form onSubmit={e => onSubmit(e)}>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            // {...register('fullname')}
            className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
            onChange={(e) => {
              send({type: 'fullname.update', value: e.target.value})
            }}
          />
          <div className="invalid-feedback">{errors.fullname?.message}</div>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            // {...register('username')}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            onChange={(e) => {
              send({type: 'username.update', value: e.target.value})
            }}
            value={state.context.username}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            // {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            onChange={(e) => {
              send({type: 'email.update', value: e.target.value})
            }}
            value={state.context.email}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            // {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            onChange={(e) => {
              send({type: 'password.update', value: e.target.value})
            }}
            value={state.context.password}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            // {...register('confirmPassword')}
            className={`form-control ${
              errors.confirmPassword ? 'is-invalid' : ''
            }`}
            onChange={(e) => {
              send({type: 'confirmPassword.update', value: e.target.value})
            }}
          />
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            // {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
            onChange={(e) => {
              send({type: 'acceptTerms.update', value: e.target.value !== ""})
            }}
          />
          <label htmlFor="acceptTerms" className="form-check-label">
            I have read and agree to the Terms
          </label>
          <div className="invalid-feedback">{errors.acceptTerms?.message}</div>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              send('RESET')
              // reset()
            }}
            className="btn btn-warning float-right"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;
