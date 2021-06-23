import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { calculatorService } from '../_services';

function List({ match }) {
  const { path } = match;
  const [calculatorHistory, setCalculatorHistory] = useState(null);

  useEffect(() => {
    calculatorService.getAll().then(x => setCalculatorHistory(x));
  }, []);

  function deleteCalculate(id) {
    setCalculatorHistory(
      calculatorHistory.map(x => {
        if (x.id === id) {
          x.isDeleting = true;
        }
        return x;
      })
    );
    calculatorService.delete(id).then(() => {
      setCalculatorHistory(calculatorHistory =>
        calculatorHistory.filter(x => x.id !== id)
      );
    });
  }

  return (
    <div>
      <h1>Calculator History</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">
        New Calculate
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '25%' }}>Num 1</th>
            <th style={{ width: '25%' }}>Operator</th>
            <th style={{ width: '25%' }}>Num 2</th>
            <th style={{ width: '25%' }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {calculatorHistory &&
            calculatorHistory.map(calc => (
              <tr key={calc.id}>
                <td>
                
                  {calc.num1}
                </td>
                <td>{calc.operator}</td>
                <td>{calc.num2}</td>
                <td>{calc.result}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <Link
                    to={`${path}/edit/${calc.id}`}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCalculate(calc.id)}
                    className="btn btn-sm btn-danger btn-delete"
                    disabled={calc.isDeleting}
                  >
                    {calc.isDeleting ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <span>Delete</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          {!calculatorHistory && (
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center" />
              </td>
            </tr>
          )}
          {calculatorHistory && !calculatorHistory.length && (
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">No Calculate History To Display</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { List };
