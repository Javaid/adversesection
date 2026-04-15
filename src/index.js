import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

var chartJsData = function (resultSet) {
  return {
    datasets: [
      {
        label: "Orders Count",
        data: resultSet.chartPivot().map(function (r) {
          return r["Orders.count"];
        }),
        backgroundColor: "rgb(255, 99, 132)"
      }
    ],
    labels: resultSet.categories().map(function (c) {
      return moment(c.x).format("DD MMM");
    })
  };
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <App />
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

