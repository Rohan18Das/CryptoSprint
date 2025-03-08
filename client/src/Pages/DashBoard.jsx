import React from 'react';
import CoinTable from '../Components/CoinTable';
import CoinPage from './CoinPage';
import Header from '../Components/Header';
import Banner from '../Components/Banner';

const DashBoard = () => {
  return (
    <div>
      <Header />
      <Banner />
        <CoinTable />
      
      
    </div>
  );
};

export default DashBoard;
