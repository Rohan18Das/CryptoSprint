import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useAuth } from '../Authentication/AuthContext';
import * as XLSX from 'xlsx';  // For Excel export
import { jsPDF } from 'jspdf'; // For PDF export
import { parse } from 'json2csv';  // For CSV export

const ProfitLossPage = () => {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [downloadFormat, setDownloadFormat] = useState('');

   
    //     if (!currentUser?.email) {
    //         setError('User is not authenticated please login');
    //         console.log('The user is',currentUser);
    //         setLoading(false);
    //         return;
    //     }
      
        
    //     const fetchTransactions = async () => {
    //         try {
    //             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
    //                 params: { email: currentUser.email },
    //             });
    //             setTransactions(response.data);
    //         } catch (error) {
    //             console.error('Error fetching transactions:', error);
    //             setError('Error fetching transactions.');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchTransactions();
    // }, [currentUser]);
    useEffect(() => {
        if (currentUser === null) {
          console.log('Authentication state is being determined...');
          return;
        }
    
        if (!currentUser?.email) {
          setError('User is not authenticated, please login');
          console.log('The user is', currentUser);
          setLoading(false);
          return;
        }
    
        const fetchTransactions = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
              params: { email: currentUser.email },
            });
            // Filter out INR transactions
            const filteredTransactions = response.data.filter(transaction => transaction.coin !== 'INR');
            setTransactions(filteredTransactions);
            setError('');
          } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Error fetching transactions.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchTransactions();
      }, [currentUser]);
    const calculateProfitLossPerCoin = () => {
        const coinData = {};

        transactions.forEach((transaction) => {
            const { coin, transactionType, quantity, price, totalPrice, createdAt, _id } = transaction;

            if (!coinData[coin]) {
                coinData[coin] = { totalCost: 0, quantity: 0, totalProfitLoss: 0, transactions: [] };
            }

            coinData[coin].transactions.push({
                transactionType,
                quantity,
                price,
                totalPrice,
                timestamp: createdAt,
                _id
            });

            if (transactionType === 'debit') {
                coinData[coin].totalCost += totalPrice;
                coinData[coin].quantity += quantity;
            } else if (transactionType === 'credit') {
                if (coinData[coin].quantity > 0) {
                    const avgBuyPrice = coinData[coin].totalCost / coinData[coin].quantity;
                    const profitLoss = (price - avgBuyPrice) * quantity;
                    coinData[coin].totalProfitLoss += profitLoss;

                    // Reduce the total cost and quantity for the coin after the sale (credit)
                    coinData[coin].totalCost -= avgBuyPrice * quantity;
                    coinData[coin].quantity -= quantity;
                }
            }
        });

        return coinData;
    };

    const coinData = calculateProfitLossPerCoin();

    const downloadCSV = () => {
        const rows = [];
        // Create header row
        rows.push([
            'Coin', 'Quantity', 'Transaction ID', 'Type', 'Price', 'Profit/Loss', 'Profit/Loss Percentage', 'Timestamp'
        ]);

        // Add transaction data rows
        Object.keys(coinData).forEach((coin) => {
            coinData[coin].transactions.forEach((transaction) => {
                const { transactionType, quantity, price, timestamp, _id } = transaction;
                const avgBuyPrice = coinData[coin].totalCost / coinData[coin].quantity;
                const profitLoss = transactionType === 'credit' ? (price - avgBuyPrice) * quantity : 0;
                const profitLossPercentage = transactionType === 'credit' ? ((profitLoss / avgBuyPrice) * 100).toFixed(2) : 0;

                rows.push([
                    coin, quantity, _id, transactionType === 'debit' ? 'Buy' : 'Sell', price, profitLoss.toFixed(2), profitLossPercentage + '%', new Date(timestamp).toLocaleString()
                ]);
            });
        });

        // Convert to CSV and download
        const csv = parse(rows);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'profit_loss_report.csv';
        link.click();
    };

    const downloadExcel = () => {
        const rows = [];
        // Create header row
        rows.push([
            'Coin', 'Quantity', 'Transaction ID', 'Type', 'Price', 'Profit/Loss', 'Profit/Loss Percentage', 'Timestamp'
        ]);

        // Add transaction data rows
        Object.keys(coinData).forEach((coin) => {
            coinData[coin].transactions.forEach((transaction) => {
                const { transactionType, quantity, price, timestamp, _id } = transaction;
                const avgBuyPrice = coinData[coin].totalCost / coinData[coin].quantity;
                const profitLoss = transactionType === 'credit' ? (price - avgBuyPrice) * quantity : 0;
                const profitLossPercentage = transactionType === 'credit' ? ((profitLoss / avgBuyPrice) * 100).toFixed(2) : 0;

                rows.push([
                    coin, quantity, _id, transactionType === 'debit' ? 'Buy' : 'Sell', price, profitLoss.toFixed(2), profitLossPercentage + '%', new Date(timestamp).toLocaleString()
                ]);
            });
        });

        // Convert to Excel and download
        const worksheet = XLSX.utils.aoa_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Profit Loss Report');
        XLSX.writeFile(workbook, 'profit_loss_report.xlsx');
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('Profit & Loss Report', 20, 20);

        // Table header
        doc.setFontSize(12);
        doc.text('Coin, Quantity, Transaction ID, Type, Price, Profit/Loss, Profit/Loss Percentage, Timestamp', 20, 40);

        // Table rows
        let y = 50;
        Object.keys(coinData).forEach((coin) => {
            coinData[coin].transactions.forEach((transaction) => {
                const { transactionType, quantity, price, timestamp, _id } = transaction;
                const avgBuyPrice = coinData[coin].totalCost / coinData[coin].quantity;
                const profitLoss = transactionType === 'credit' ? (price - avgBuyPrice) * quantity : 0;
                const profitLossPercentage = transactionType === 'credit' ? ((profitLoss / avgBuyPrice) * 100).toFixed(2) : 0;

                doc.text(`${coin}, ${quantity}, ${_id}, ${transactionType === 'debit' ? 'Buy' : 'Sell'}, ${price}, ₹${profitLoss.toFixed(2)}, ${profitLossPercentage}%, ${new Date(timestamp).toLocaleString()}`, 20, y);
                y += 10;
            });
        });

        // Save PDF
        doc.save('profit_loss_report.pdf');
    };

    const handleDownload = (format) => {
        switch (format) {
            case 'csv':
                downloadCSV();
                break;
            case 'excel':
                downloadExcel();
                break;
            case 'pdf':
                downloadPDF();
                break;
            default:
                break;
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Profit & Loss Analysis Report
            </Typography>
            <Typography variant="body1" paragraph>
                This dashboard provides a comprehensive overview of your cryptocurrency investments. Analyze the profit and loss for each coin and keep track of your portfolio performance. Download the data in your preferred format for deeper analysis.
            </Typography>

            {/* Download Dropdown */}
            <FormControl variant="outlined" sx={{ mb: 2, minWidth: 200, float: 'right' }}>
                <InputLabel>Download as</InputLabel>
                <Select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value)}
                    label="Download as"
                >
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                </Select>
                <Button variant="contained" style={{ backgroundColor: 'gold', color: 'black', marginTop: '8px' }} onClick={() => handleDownload(downloadFormat)}>
                    Download
                </Button>
            </FormControl>

            <Paper sx={{ width: '100%', overflow: 'auto' }}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>Coin</TableCell>
        <TableCell sx={{
          whiteSpace: 'nowrap',
          display: { xs: 'none', sm: 'table-cell' }, // Hide on small screens
        }}>
          Quantity
        </TableCell>
        <TableCell sx={{
          whiteSpace: 'nowrap',
          display: { xs: 'none', md: 'table-cell' }, // Hide on medium and smaller screens
        }}>
          Transaction ID
        </TableCell>
        <TableCell>Type</TableCell>
        <TableCell>Price</TableCell>
        <TableCell sx={{ color: 'inherit', fontWeight: 'bold' }}>Profit/Loss</TableCell>
        <TableCell sx={{
          whiteSpace: 'nowrap',
          display: { xs: 'none', lg: 'table-cell' }, // Hide on small/medium screens
        }}>
          Profit/Loss Percentage
        </TableCell>
        <TableCell sx={{
          whiteSpace: 'nowrap',
          display: { xs: 'none', md: 'table-cell' }, // Hide on smaller screens
        }}>
          Timestamp
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Object.keys(coinData).map((coin) =>
        coinData[coin].transactions.map((transaction) => {
          const { transactionType, quantity, price, timestamp, _id } = transaction;
          const avgBuyPrice = coinData[coin].totalCost / coinData[coin].quantity;
          const profitLoss = transactionType === 'credit'
            ? (price - avgBuyPrice) * quantity
            : 0;
          const profitLossColor = profitLoss >= 0 ? 'green' : 'red';
          const profitLossText = `₹${profitLoss.toFixed(2)}`;
          const profitLossPercentage = transactionType === 'credit'
            ? ((profitLoss / avgBuyPrice) * 100).toFixed(2) + '%'
            : '0%';

          return (
            <TableRow key={_id}>
              <TableCell>{coin}</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{quantity}</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{_id}</TableCell>
              <TableCell>{transactionType === 'debit' ? 'Buy' : 'Sell'}</TableCell>
              <TableCell>{price}</TableCell>
              <TableCell style={{ color: profitLossColor }}>{profitLossText}</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: profitLossColor }}>
                {profitLossPercentage}
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                {new Date(timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>
</Paper>

            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                Portfolio Overview
            </Typography>
            <Typography variant="body1">
                Total Invested Amount: ₹{transactions.reduce((acc, transaction) => transaction.transactionType === 'debit' ? acc + transaction.totalPrice : acc, 0).toFixed(2)}
            </Typography>
            <Typography variant="body1">

            Current Portfolio Value: ₹{transactions.reduce((acc, transaction) => acc + (transaction.transactionType === 'debit' ? transaction.totalPrice : -transaction.totalPrice), 0).toFixed(2)}

            </Typography>
        </Box>
    );
};

export default ProfitLossPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Paper, Alert } from '@mui/material';
// import { useAuth } from '../Authentication/AuthContext';

// const ProfitLossPage = () => {
//   const { currentUser } = useAuth();
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (currentUser === null) {
//       console.log('Authentication state is being determined...');
//       return;
//     }

//     if (!currentUser?.email) {
//       setError('User is not authenticated, please login');
//       console.log('The user is', currentUser);
//       setLoading(false);
//       return;
//     }

//     const fetchTransactions = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`, {
//           params: { email: currentUser.email },
//         });
//         setTransactions(response.data);
//         setError('');
//       } catch (error) {
//         console.error('Error fetching transactions:', error);
//         setError('Error fetching transactions.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [currentUser]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (error) {
//     return <Alert severity="error">{error}</Alert>;
//   }

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Profit & Loss Analysis Report
//       </Typography>
//       <Typography variant="body1" paragraph>
//         This dashboard provides a comprehensive overview of your cryptocurrency investments. Analyze the profit and loss for each coin and keep track of your portfolio performance.
//       </Typography>

//       <Paper sx={{ width: '100%', overflow: 'auto' }}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Coin</TableCell>
//               <TableCell>Quantity</TableCell>
//               <TableCell>Transaction ID</TableCell>
//               <TableCell>Type</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Timestamp</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {transactions.map((transaction) => (
//               <TableRow key={transaction._id}>
//                 <TableCell>{transaction.coin}</TableCell>
//                 <TableCell>{transaction.quantity}</TableCell>
//                 <TableCell>{transaction._id}</TableCell>
//                 <TableCell>{transaction.transactionType === 'debit' ? 'Buy' : 'Sell'}</TableCell>
//                 <TableCell>{transaction.price}</TableCell>
//                 <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>
//     </Box>
//   );
// };

// export default ProfitLossPage;
