import { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { useWeb3 } from '../contexts/Web3Context';
import { useContract } from '../components/contracts/useContract';
import { ethers } from 'ethers';

const InvoiceLookup = () => {
  const { isConnected } = useWeb3();
  const { contract } = useContract();
  const [invoiceId, setInvoiceId] = useState('');
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!invoiceId.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setInvoice(null);
      
      const invoiceData = await contract.getInvoice(invoiceId);
      
      setInvoice({
        id: invoiceId,
        seller: invoiceData.seller,
        buyer: invoiceData.buyer,
        amount: ethers.utils.formatEther(invoiceData.amount),
        tax: ethers.utils.formatEther(invoiceData.tax),
        timestamp: new Date(invoiceData.timestamp * 1000).toLocaleString(),
        currency: invoiceData.currency,
        valid: invoiceData.valid ? 'Valid' : 'Invalid'
      });
    } catch (err) {
      console.error("Failed to fetch invoice:", err);
      setError("Invoice not found or invalid ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Lookup
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          label="Invoice ID"
          variant="outlined"
          fullWidth
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          disabled={loading || !isConnected}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !isConnected || !invoiceId.trim()}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>
      
      {!isConnected && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Connect your wallet to search for invoices
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {invoice && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Invoice Details
          </Typography>
          
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell>{invoice.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Seller</strong></TableCell>
                  <TableCell>{invoice.seller}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Buyer</strong></TableCell>
                  <TableCell>{invoice.buyer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell>{invoice.amount} {invoice.currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Tax</strong></TableCell>
                  <TableCell>{invoice.tax} {invoice.currency}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell>{invoice.timestamp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell>{invoice.valid}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Recent Invoices
      </Typography>
      <Typography color="text.secondary">
        Recent invoices list will be displayed here
      </Typography>
    </Container>
  );
};

export default InvoiceLookup;