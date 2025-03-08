import React, { useState } from "react";
import { Box, Typography, IconButton, Container, Grid, Divider, Switch, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Facebook, Twitter, Instagram, YouTube, Reddit } from "@mui/icons-material";

const socialIcons = [
  { icon: <Facebook />, label: "Facebook" },
  { icon: <Twitter />, label: "Twitter" },
  { icon: <Instagram />, label: "Instagram" },
  { icon: <YouTube />, label: "YouTube" },
  { icon: <Reddit />, label: "Reddit" }
];

const footerLinks = {
  community: ["Facebook", "Twitter", "Instagram", "YouTube", "Reddit"],
  aboutUs: ["About", "Careers", "Announcements", "News", "Press", "Legal", "Terms", "Privacy", "Building Trust", "Blog", "Community", "Risk Warning", "Notices", "Downloads"],
  products: ["Exchange", "Buy Crypto", "Pay", "Academy", "Live", "Tax", "Gift Card", "Launchpool", "Auto-Invest", "ETH Staking", "NFT", "BABT", "Research", "Charity"],
  business: ["P2P Merchant Application", "P2Pro Merchant Application", "Listing Application", "Institutional & VIP Services", "Labs", "Binance Connect"],
  service: ["Affiliate", "Referral", "OTC Trading", "Historical Market Data", "Proof of Reserves"]
};

const Footer = () => {
  const [language, setLanguage] = useState("en");
  const [darkMode, setDarkMode] = useState(true);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "transparent" : "#fff",
        color: darkMode ? "#fff" : "#000",
        padding: "40px 0",
        width: "100vw",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px" }}>Community</Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {socialIcons.map((social, index) => (
                <IconButton key={index} sx={{ margin: "0 5px", color: darkMode ? "#aaa" : "#000", "&:hover": { color: "#f3ba2f" } }} aria-label={social.label}>
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
          {Object.keys(footerLinks).map((sectionKey) => (
            <Grid item xs={6} sm={4} md={2} key={sectionKey}>
              <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px" }}>{sectionKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Typography>
              {footerLinks[sectionKey].map((link, index) => (
                <Typography key={index} sx={{ color: darkMode ? "#aaa" : "#000", marginBottom: "5px", display: "block", "&:hover": { color: "#f3ba2f" } }}>
                  {link}
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 3, borderColor: darkMode ? "#333" : "#aaa" }} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: { xs: 'column', sm: 'row' } }}>
          <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
            <InputLabel sx={{ color: darkMode ? "#fff" : "#000" }}>Language</InputLabel>
            <Select value={language} label="Language" onChange={handleLanguageChange} sx={{ color: darkMode ? "#fff" : "#000" }}>
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
              <MenuItem value="fr">French</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" sx={{ color: darkMode ? "#aaa" : "#000", marginTop: { xs: '10px', sm: '0' } }}>© 2024 Cryptosprint</Typography>
          <Switch checked={!darkMode} onChange={toggleDarkMode} />
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
