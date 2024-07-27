// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    presentStudents: 0,
    absentStudents: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:3000/api/metrics')
      .then(response => {
        setMetrics(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const metricCards = [
    { title: 'Total Students', value: metrics.totalStudents, color: '#007bff' },
    { title: 'Present Students', value: metrics.presentStudents, color: '#17a2b8' },
    { title: 'Absent Students', value: metrics.absentStudents, color: '#28a745' }
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: '70px', marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ backgroundColor: metric.color, color: '#fff' }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {metric.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;