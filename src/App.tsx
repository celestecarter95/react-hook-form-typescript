import './App.css';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useMachine } from '@xstate/react';
import FormMachine, { UserSubmitForm } from './fsm';
import { TextField } from '@mui/material';

const App: React.FC = () => {
  const [state, send] = useMachine(FormMachine)

  const validationSchema = Yup.object().shape({
    usernameOnly: Yup.string(),
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
    getValues,
    watch,
    control,
    formState: { errors }
  } = useForm<UserSubmitForm>({
    resolver: yupResolver(validationSchema)
  });

  const watchUsernameOnly = watch("usernameOnly", "")

  const onSubmit = (data: UserSubmitForm) => {
    console.log("data: usernameOnly", data.usernameOnly)
    console.log(JSON.stringify(data, null, 2));
    send({type: 'REGISTER', data: data})
  };

  useEffect(() => {
    console.log('errors', errors.fullname)
  }, [errors])

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group form-check">
          <Controller
            name="usernameOnly"
            control={control}
            render={({field}) => (
              <TextField 
                label="UsernameOnly"
                {...field}
              />
            )}
          />
        </div>

        <div className="form-group">
          <p>Watch usernameonly {watchUsernameOnly}</p>
          {watchUsernameOnly !== "yes" && <Controller
            name="fullname"
            control={control}
            render={({field}) => (
              <TextField 
                label="Full Name"
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
                {...field}
              />
            )}
          />
          }
        </div>

        <div className="form-group">
          <Controller
            name="username"
            control={control}
            render={({field}) => (
              <TextField 
                label="Username"
                error={!!errors.username}
                helperText={errors.username?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            {...register('email')}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className={`form-control ${
              errors.confirmPassword ? 'is-invalid' : ''
            }`}
          />
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        </div>

        <div className="form-group form-check">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className={`form-check-input ${
              errors.acceptTerms ? 'is-invalid' : ''
            }`}
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
            onClick={() => send({type: 'VALIDATE', password: getValues('password'), confirmPassword: getValues('confirmPassword')})}
            className="btn btn-warning float-right"
          >
            Validate
          </button>
          <button
            type="button"
            onClick={() => reset()}
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
