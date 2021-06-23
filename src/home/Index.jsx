import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Calculator</h1>

      <p>
        <Link to="calculator/add">Start Calculator</Link>
        {/* <Link to="calculator">&gt;&gt; Start Calculator</Link> */}
      </p>
    </div>
  );
}

export { Home };
