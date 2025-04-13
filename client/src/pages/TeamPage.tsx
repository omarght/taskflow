import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { getTeamById } from '../services/TeamServices';
import TeamTasks from '../misc/TeamTasks';
import TeamProjects from '../misc/TeamProjects';
import TeamMembers from '../misc/TeamMembers';
import Breadcrumbs from '../misc/Breadcrumbs';

interface TeamPageProps {}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        style={{ width: '100%' }}
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

const TeamPage: React.FC<TeamPageProps> = () => {
    const { id } = useParams<{ id: string }>(); // Extract team ID from URL
    const navigate = useNavigate();

    const [team, setTeam] = useState<any>(null);
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openMiscForm, setOpenMiscForm] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const fetchTeam = async () => {
        setLoading(true);
        setError(null);
        try {
            const { team, error } = await getTeamById(id!); // Replace `id!` with your service call logic
            if (error) {
                setError("Failed to fetch team details. Please try again.");
            } else {
                setTeam(team);
            }
        } catch (e) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid container spacing={2}>
            <Grid size={12} sx={{ mt: 2, p: 3 }}>
                <Breadcrumbs />
            </Grid>

            <Grid size={12}>
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab label="Projects" />
                    <Tab label="Members" />
                    <Tab label="Tasks" />
                </Tabs>
            </Grid>


            <TabPanel value={tab} index={0}>
                {id ? (
                    <TeamProjects teamId={id} />
                ) : (
                    <Typography variant="body1">Team ID is missing</Typography>
                )}
            </TabPanel>
                
            <TabPanel value={tab} index={1}>
                {id ? (    
                    <TeamMembers teamId={id} />
                ) : (
                    <Typography variant="body1">Team ID is missing</Typography>
                )}
            </TabPanel>
            <TabPanel value={tab} index={2}>
                {id ? (
                    <TeamTasks teamId={id} />
                ) : (
                    <Typography variant="body1">Team ID is missing</Typography>
                )}
            </TabPanel>
        </Grid>
    );
};

export default TeamPage;
