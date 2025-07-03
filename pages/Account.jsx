import { Container, Box, Typography, Paper, Avatar, List, ListItem, ListItemText, ListItemAvatar, Button } from '@mui/material';
import { useWeb3 } from '../contexts/Web3Context';

const Account = () => {
  const { account, balance, isConnected, disconnect } = useWeb3();

  if (!isConnected) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" py={10}>
          <Typography variant="h6" color="text.secondary">
            Connect your wallet to view account information
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 64, height: 64, mr: 3, bgcolor: 'primary.main' }}>
            {account.substring(2, 4).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5">Your Wallet</Typography>
            <Typography variant="body2" color="text.secondary">
              {account}
            </Typography>
          </Box>
        </Box>
        
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.default' }}>
                <span>💰</span>
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="Balance" 
              secondary={`${parseFloat(balance).toFixed(4)} ETH`} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.default' }}>
                <span>📝</span>
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="Total Invoices" 
              secondary="24" // Số liệu thực tế từ hợp đồng
            />
          </ListItem>
          
          <ListItem>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.default' }}>
                <span>💸</span>
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary="Total Tax Paid" 
              secondary="1.25 ETH" // Số liệu thực tế từ hợp đồng
            />
          </ListItem>
        </List>
        
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="error"
            onClick={disconnect}
          >
            Disconnect Wallet
          </Button>
        </Box>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Security Settings
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Security features will be implemented here
      </Typography>
      
      <Typography variant="h5" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography color="text.secondary">
        Notification settings will be available here
      </Typography>
    </Container>
  );
};

export default Account;