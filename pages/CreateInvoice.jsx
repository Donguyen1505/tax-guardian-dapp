import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, TextField, Button, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useWeb3 } from '../contexts/Web3Context';
import { useContract } from '../components/contracts/useContract';
import { ethers } from 'ethers';

const CreateInvoice = () => {
  const { isConnected, account } = useWeb3();
  const { contract } = useContract();
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);
  const [error, setError] = useState(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      buyer: '',
      amount: '',
      currency: ''
    }
  });

  useEffect(() => {
    const fetchCurrencies = async () => {
      if (contract && isConnected) {
        try {
          const currencyList = await contract.listCurrencies();
          setCurrencies(currencyList);
        } catch (err) {
          console.error("Failed to fetch currencies:", err);
        }
      }
    };
    
    fetchCurrencies();
  }, [contract, isConnected]);

  const onSubmit = async (data) => {
    if (!isConnected || !contract) {
      setError("Wallet not connected");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      // Chuyển đổi số tiền sang wei
      const amountInWei = ethers.utils.parseEther(data.amount);
      
      // Tạo hóa đơn
      const tx = await contract.createInvoice(data.buyer, amountInWei, data.currency);
      const receipt = await tx.wait();
      
      // Tìm invoiceId từ sự kiện (giả sử hợp đồng phát sự kiện InvoiceCreated)
      let invoiceId = null;
      if (receipt.events) {
        for (const event of receipt.events) {
          if (event.event === "InvoiceCreated") {
            invoiceId = event.args.tokenId.toString();
            break;
          }
        }
      }
      
      setInvoiceId(invoiceId);
      setSuccess(true);
    } catch (err) {
      console.error("Failed to create invoice:", err);
      setError(err.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" py={10}>
          <Typography variant="h6" color="text.secondary">
            Connect your wallet to create invoices
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Invoice
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="buyer"
              control={control}
              rules={{ required: 'Buyer address is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Buyer Address"
                  variant="outlined"
                  fullWidth
                  error={!!errors.buyer}
                  helperText={errors.buyer?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="amount"
              control={control}
              rules={{ 
                required: 'Amount is required',
                validate: value => parseFloat(value) > 0 || 'Amount must be positive'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  variant="outlined"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  error={!!errors.amount}
                  helperText={errors.amount?.message}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Controller
              name="currency"
              control={control}
              rules={{ required: 'Currency is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Currency"
                  variant="outlined"
                  fullWidth
                  error={!!errors.currency}
                  helperText={errors.currency?.message}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Invoice'}
            </Button>
          </Grid>
          
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          
          {success && invoiceId && (
            <Grid item xs={12}>
              <Alert severity="success">
                Invoice created successfully! ID: {invoiceId}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateInvoice;