import { useState, useContext  } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";
import {
  Home,
  PieChart,
  Troubleshoot,
  AccountCircle,
  TrendingUp,
  ManageAccounts
} from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";
import { useIntl } from "react-intl";
import { AuthContext } from "../../api/auth/TkAuthService";
import KP from "./kp.png";


function LayoutDefault() {
  const intl = useIntl();

  const authContext = useContext(AuthContext);
  const user = authContext.user

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#fff",
          color: "#000", // <-- icon/text color
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left section: Logo / Title */}
          <Box display="flex" alignItems="center" gap={2}>
            <img src={KP} alt="kaiser.partner" width={114} height={64} />


            {/* Navigation Buttons */}
            <Box display="flex" gap={1}>
              <Button
                color="inherit"
                startIcon={<Home />}
                component={Link}
                to="/main/home"
              >
                {intl.formatMessage({ id: "home", defaultMessage: "Home" })}
              </Button>
              <Button
                color="inherit"
                startIcon={<PieChart />}
                component={Link}
                to="/main/assets"
              >
                {intl.formatMessage({ id: "assets", defaultMessage: "Assets" })}
              </Button>   
              <Button
                color="inherit"
                startIcon={<TrendingUp />}
                component={Link}
                to="/main/performance"
              >
                {intl.formatMessage({ id: "performance", defaultMessage: "Performance" })}
              </Button>  
              <Button
                color="inherit"
                startIcon={<Troubleshoot/>}
                component={Link}
                to="/main/stress-scenarios"
              >
                {intl.formatMessage({ id: "riskAssessment", defaultMessage: "Risk Assessment" })}
              </Button> 
              { user?.role === "Admin" && (
              <Button
                color="inherit"
                startIcon={<ManageAccounts />}
                component={Link}
                to="/main/data-management"
              >
                {intl.formatMessage({ id: "dataManagement", defaultMessage: "Data Management" })}
              </Button>   
              )}           
            </Box>
          </Box>

          {/* Right section: Tools & Profile */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* Language */}
            <Tooltip title="Change Language">
              <Box display="flex" alignItems="center" marginRight={0.5} >
                <Typography variant="caption" fontSize={14.5}>
                  EN
                </Typography>
              </Box>
            </Tooltip>

            {/* User */}
            <Tooltip title="Profile">
              <Box display="flex" alignItems="center" sx={{ cursor: "pointer" }}>
                <Typography variant="body2" sx={{ color: "black", mr: 1 }}>
                  {user?.role}  
                </Typography>
                <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <AccountCircle />
                </IconButton>
              </Box>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem component={Link} to="/pages/profile">
                <AccountCircle sx={{ mr: 1 }} />
                {intl.formatMessage({ id: "myProfile", defaultMessage: "My Profile" })}
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default LayoutDefault;