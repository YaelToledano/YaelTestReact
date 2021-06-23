import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { calculatorService, alertService } from '../_services';

function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;

  // form validation rules
  const validationSchema = Yup.object().shape({
    num1: Yup.string().required('Num1 is required'),
    operator: Yup.string().required('Operator Name is required'),
    num2: Yup.string().required('Num2 Name is required')
  });

  // functions to build form returned by useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    errors,
    formState
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  function onSubmit(data) {
    return isAddMode ? createCalculate(data) : updateCalculate(id, data);
  }

  function createCalculate(data) {
    return calculatorService
      .create(data)
      .then(calc => {
        alertService.success('Calculate added', { keepAfterRouteChange: true });
        setFields(calc);
      })
      .catch(alertService.error);
  }

  function updateCalculate(id, data) {
    return calculatorService
      .update(id, data)
      .then(calc => {
        alertService.success('Calculate updated', {
          keepAfterRouteChange: true
        });
        setFields(calc);
        //history.push('..');
      })
      .catch(alertService.error);
  }

  function setFields(calc) {
    const fields = ['num1', 'operator', 'num2', 'result'];
    fields.forEach(field => setValue(field, calc[field]));
    setCalculate(calc);
  }
  function clear(e)
  {
    e.preventDefault();
    const fields = ['num1', 'operator', 'num2', 'result'];
    fields.forEach(field => setValue(field, null));
  }
  const [calculate, setCalculate] = useState({});

  useEffect(() => {
    if (!isAddMode) {
      // get calc and set form fields
      calculatorService.getById(id).then(calc => {
        setFields(calc);
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
      <h1>{isAddMode ? 'Calculate' : 'Edit Calculate'}</h1>
      <div className="form-row">
        <div className="form-group col-5">
          <label>Num 1</label>
          <input
            name="num1"
            type="text"
            ref={register}
            className={`form-control ${errors.num1 ? 'is-invalid' : ''}`}
          />
          <div className="invalid-feedback">{errors.num1?.message}</div>
        </div>
        <div className="form-group col">
          <label>Operator</label>
          <select
            name="operator"
            ref={register}
            className={`form-control ${errors.operator ? 'is-invalid' : ''}`}
          >
            <option value="" />
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
          </select>
          <div className="invalid-feedback">{errors.operator?.message}</div>
        </div>

        <div className="form-group col-5">
          <label>Num2</label>
          <input
            name="num2"
            type="text"
            ref={register}
            className={`form-control ${errors.num2 ? 'is-invalid' : ''}`}
            pattern="[0-9]*"
          />
          <div className="invalid-feedback">{errors.num2?.message}</div>
        </div>
        <div className="form-group col-5">
          <label>Result</label>
          <input
            name="result"
            type="text"
            ref={register}
            disabled={true}
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="btn btn-primary"
        >
          {formState.isSubmitting && (
            <span className="spinner-border spinner-border-sm mr-1" />
          )}
          Calculate & Save
        </button>

        <button className="btn btn-primary btn-marging-left" onClick={clear}>
          Clear
        </button>

        <Link to={isAddMode ? '.' : '..'} className="btn btn-link">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export { AddEdit };
