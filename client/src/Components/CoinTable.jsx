import React, { useState, useEffect, useContext } from 'react';
import {
  Box, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, useMediaQuery, LinearProgress
} from '@mui/material';
import axios from 'axios';
import { Crypto } from '../Context/CryptoContext';
import { CoinList } from '../API/ApiEndPoint';
import { numberWithCommas } from '../Components/Carousel';
import { useNavigate } from 'react-router-dom';
import CoinPage from '../Pages/CoinPage';
// CoinTable component
const CoinTable = () => {
  const { currency, symbol } = useContext(Crypto);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(min-width:601px) and (max-width:1024px)');

  const fetchCoins = async () => {
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching coins:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () => {
    return coins.filter((coin) => coin.name.toLowerCase().includes(search.toLowerCase()));
  };

  const handleSort = (event) => {
    const value = event.target.value;
    setSort(value);
    let sortedCoins;
    if (value === "az") {
      sortedCoins = coins.sort((a, b) => a.name.localeCompare(b.name));
    } else if (value === "profit") {
      sortedCoins = coins.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    } else if (value === "price") {
      sortedCoins = coins.sort((a, b) => b.current_price - a.current_price);
    }
    setCoins([...sortedCoins]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ width: 'auto', overflow: 'hidden' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            whiteSpace: 'nowrap',
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            padding: '1rem'
          }}
        >
          Top Cryptocurrencies by Market Cap
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <TextField
          label="Search for a coin..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: isMobile ? '100%' : '60%', marginBottom: isMobile ? '10px' : '0' }}
        />
        <Select
          value={sort}
          onChange={handleSort}
          displayEmpty
          sx={{ width: isMobile ? '100%' : '15%' }}
        >
          <MenuItem value="" disabled>
            Sort by
          </MenuItem>
          <MenuItem value="az">A to Z</MenuItem>
          <MenuItem value="profit">Profit</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        {loading ? (
          <LinearProgress style={{ backgroundColor: "gold" }} />
        ) : (
          <>
            {handleSearch().length === 0 ? (
              <Typography className="no-coins" style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
                No coins found
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'gold', borderBottom: '2px solid lightblue', color: 'dark' }}>
                    {!isMobile && !isMedium &&
                      <TableCell sx={{ borderRight: '1px solid lightblue', fontWeight: 'bold', color: 'black' }}>Rank</TableCell>
                    }
                    <TableCell sx={{ borderRight: '1px solid lightblue', fontWeight: 'bold', color: 'black' }}>Coin</TableCell>
                    <TableCell align="right" sx={{ borderRight: '1px solid lightblue', color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                    {!isMedium && <TableCell align="right" sx={{ color: "black", fontWeight: "700", fontFamily: "Montserrat" }}>24h Change</TableCell>}
                    {!isMobile && <TableCell align="right" sx={{ fontWeight: 'bold', color: 'black' }}>Market Cap</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {handleSearch().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((coin) => (
                    <TableRow
                      key={coin.id}
                      onClick={() => navigate(`/coins/${coin.id}`)}
                      sx={{
                        backgroundColor: '#16171a',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#131111'
                        }
                      }}
                    >
                      {!isMobile && !isMedium && <TableCell>{coin.market_cap_rank}</TableCell>}
                      <TableCell component="th" scope="row"
                         
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            height="50"
                            style={{ marginRight: 25, cursor: 'pointer' }}
                         
                          />
                          <div style={{ textAlign: 'left' }}>
                            <span>{coin.symbol.toUpperCase()}</span>
                            <br />
                            <span>{coin.name}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                      </TableCell>
                      {!isMedium && (
                        <TableCell align="right" style={{ color: coin.price_change_percentage_24h > 0 ? 'rgb(14, 203, 129)' : 'red', fontWeight: 500 }}>
                          {coin.price_change_percentage_24h > 0 && '+'}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell align="right">
                          {symbol} {numberWithCommas(coin.market_cap.toString())}
                        </TableCell>
                      )}
                    </TableRow>

                  ))}
                </TableBody>
              </Table>
            )}
          </>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={handleSearch().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default CoinTable;
