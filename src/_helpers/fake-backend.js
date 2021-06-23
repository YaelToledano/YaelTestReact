import { Role } from './';

export function configureFakeBackend() {
  // array in local storage for new records
  let calculatorHistory = JSON.parse(
    localStorage.getItem('calculatorHistory')
  ) || [
    {
      id: 1,
      num1: 1,
      operator: '+',
      num2: 2,
      result: 3
    }
  ];

  // monkey patch fetch to setup fake backend
  let realFetch = window.fetch;
  window.fetch = function(url, opts) {
    return new Promise((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(handleRoute, 500);

      function handleRoute() {
        const { method } = opts;
        switch (true) {
          case url.endsWith('/calculator') && method === 'GET':
            return getCalculaorHistory();
          case url.match(/\/calculator\/\d+$/) && method === 'GET':
            return getCalculateById();
          case url.endsWith('/calculator') && method === 'POST':
            return createCalculate();
          case url.match(/\/calculator\/\d+$/) && method === 'PUT':
            return updateCalculate();
          case url.match(/\/calculator\/\d+$/) && method === 'DELETE':
            return deleteCalculate();
          default:
            // pass through any requests not handled above
            return realFetch(url, opts)
              .then(response => resolve(response))
              .catch(error => reject(error));
        }
      }

      // route functions

      function getCalculaorHistory() {
        return ok(calculatorHistory);
      }

      function getCalculateById() {
        let calc = calculatorHistory.find(x => x.id === idFromUrl());
        return ok(calc);
      }

      function calculate(num1, operator, num2) {
        switch (operator) {
          case '+':
            return parseInt(num1) + parseInt(num2);
          case '-':
            return parseInt(num1) - parseInt(num2);
          case '*':
            return parseInt(num1) * parseInt(num2);
          case '/':
            return parseInt(num1) / parseInt(num2);
        }
      }
      function createCalculate() {
        const calc = body();

        if (
          calculatorHistory.find(
            x =>
              x.num1 === calc.num1 &&
              x.operator === calc.operator &&
              x.num2 === calc.num2
          )
        ) {
          return error(
            `This calculate ${calc.num1}${calc.operator}${
              calc.num2
            } already exists`
          );
        }

        // assign calc id and a few other properties then save
        calc.id = newCalcId();
        calc.result = calculate(calc.num1, calc.operator, calc.num2);
        calculatorHistory.push(calc);
        localStorage.setItem(
          'calculatorHistory',
          JSON.stringify(calculatorHistory)
        );

        return ok(calc);
      }

      function updateCalculate() {
        let params = body();
        let calc = calculatorHistory.find(x => x.id === idFromUrl());

        calc.num1 = params.num1;
        calc.operator = params.operator;
        calc.num2 = params.num2;
        calc.result = calculate(params.num1, params.operator, params.num2);
        // update and save
        Object.assign(calculatorHistory, calc);
        localStorage.setItem(
          'calculatorHistory',
          JSON.stringify(calculatorHistory)
        );

        return ok(calc);
      }

      function deleteCalculate() {
        calculatorHistory = calculatorHistory.filter(x => x.id !== idFromUrl());
        localStorage.setItem(
          'calculatorHistory',
          JSON.stringify(calculatorHistory)
        );

        return ok();
      }

      // helper functions

      function ok(body) {
        resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(body))
        });
      }

      function error(message) {
        resolve({
          status: 400,
          text: () => Promise.resolve(JSON.stringify({ message }))
        });
      }

      function idFromUrl() {
        const urlParts = url.split('/');
        return parseInt(urlParts[urlParts.length - 1]);
      }

      function body() {
        return opts.body && JSON.parse(opts.body);
      }

      function newCalcId() {
        return calculatorHistory.length
          ? Math.max(...calculatorHistory.map(x => x.id)) + 1
          : 1;
      }
    });
  };
}
