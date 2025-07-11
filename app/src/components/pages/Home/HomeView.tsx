import styles from "../../../views/pages/css/ViewDefault.module.css";
import { ViewProps } from "../../../views/types/ViewProps";
import { useNavigate } from "react-router-dom";

// Import feature card images
import portfolio from "./images/portfolio.png";
import performance from "./images/performance.png";
import risk from "./images/risk.png";


import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";

function HomeView({}: ViewProps) {
  const navigate = useNavigate();

  // User name would normally come from authentication or user context
  const userName = "Mr.Frei & Mr.Buhmann";

  // Define the feature cards for the dashboard homepage
  const cards = [
    {
      title: "Assets",
      description: "View and manage your portfolio assets.",
      image: portfolio,
      path: "/main/assets",
    },
    {
      title: "Performance",
      description: "Track portfolio performance and compare it against relevant benchmarks.",
      image: performance,
      path: "/main/performance",
    },
    {
      title: "Stress Scenarios",
      description: "Simulate and review risk scenarios.",
      image: risk,
      path: "/main/stress-scenarios",
    },
  ];

  return (
    <Box className={styles.defaultView} textAlign="center" mt={4}>
      {/* Welcome message with user name */}
      <Typography variant="h4" gutterBottom>
        Welcome to your Family Office Portfolio Account, {userName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Select a section below to get started.
      </Typography>

      {/* Feature cards grid layout */}
      <Grid container spacing={4} justifyContent="center" alignItems="center" marginTop={10}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
              </CardContent>
              {/* Clickable area that navigates to feature page */}
              <CardActionArea onClick={() => navigate(card.path)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={card.image}
                  alt={card.title}
                  sx={{ borderRadius: "50%", width: 200, height: 200, margin: "16px auto" }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomeView;
