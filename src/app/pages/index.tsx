import { BottomNavigation, Button, CardContent, Container, Fab, Typography } from "@mui/material";
import { alignProperty, convertLength } from "@mui/material/styles/cssUtils";
import Card from '@mui/material/Card';
import { Box } from "@mui/system";
import { FAQ } from "ui/components/faq";
import Link from "next/link";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Image from "next/image";

const queryClient = new QueryClient();

export async function getServerSideProps({ req }) {
    const { 
        origin = req.headers['host']
    } = new URL(req.headers?.['referer'] || 'http://' + req.headers?.['host']);
    const { landing, about } = await (await fetch(origin + '/api/details')).json();
    return {
        props: {
            landing,
            about,
        }
    }
}

// Each of the page components will take up one view for each computer. That way it is consistent.

//Landing page component first thing you will see when you load the website.
function LandingPage(props: { data }) {
    // pulls data from api that staff specify
    const { isLoading, error, data = props.data } = useQuery(['details', 'landing'], () => {
        return fetch('/api/details/landing')
            .then(response => response.json())
    })
    const { title, subtitle, backgroundImage, logo } = data;
    return <Box sx={{ backgroundColor: "lightblue", width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", textAlign: 'center' }}>
        <Box id="logo-container" sx={{ textAlign: 'center', mt: 10 }}>
            <img src={logo} style={{ padding: '20px', width: '300px', maxWidth: '90vw' }} />
            <Typography variant="h2">{title}</Typography>
        </Box>
        <Box id="lading-content-container" sx={{ textAlign: 'center' }}>
            <Typography variant="h4">{subtitle}</Typography>
            <Link href={'/register'}>
                <Button variant="contained" color="primary" sx={{ m: 2 }}>
                    <Typography variant="h6">Register Here</Typography>
                </Button>
            </Link>
        </Box>
    </Box>
}

//About component for about the organization or event that the staff can change details about.
function AboutPage(props: { data }) {
    //pulling data from api about the details
    const { isLoading, error, data = props.data } = useQuery(['details', 'about'], () => {
        return fetch('/api/details/about')
            .then(response => response.json())
    })
    const { title, subtitle, info, content } = data;
    return <Box sx={{ backgroundColor: 'lightpink', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", textAlign: 'center' }}>
        <Typography variant="h3" sx={{ textAlign: 'left', padding: '20px' }}>{title}</Typography>
        <Typography variant="h4" sx={{ textAlign: 'right', padding: '30px' }}>{info}</Typography>
        <Box sx={{ width: '50%', m: 'auto' }}>
            <Card>
                <CardContent>
                    <Typography component="pre" sx={{ textAlign: 'center' }}>{content}</Typography>
                </CardContent>
            </Card>
        </Box>
    </Box>
}

// FAQ page using accordian from the FAQ component from the components folder.
function FAQPage() {
    return <Box id="faq" sx={{ backgroundColor: 'cornsilk', width: '100%', height: '100%', backgroundSize: "cover", backgroundRepeat: "no-repeat", alignContent: 'center', textAlign: 'center', pt: 5 }}>
        <Typography variant="h3">FAQ</Typography>
        <Box sx={{ margin: 'auto', width: 'min(800px, 95vw)', mt: 2 }}>
            <FAQ />
        </Box>
        <Box sx={{ mt: 3 }}>
            <Link href="/contact">
                <Button variant="contained" color="inherit">Contact Us</Button>
            </Link>
        </Box>
    </Box>
}

//footer for possible sponsors
function Footer() {
    return <Box sx={{ backgroundColor: 'lightsalmon', height: '100px' }}>
        <Typography variant="h5" sx={{ textAlign: 'initial' }}>Powered By</Typography>
    </Box>
}

//Homepage utilizing all of the components
export default function Homepage({ landing, about }) {
    return <QueryClientProvider client={queryClient}>
        <Box>
            <Box height='100vh' display="flex" flexDirection="column">
                <LandingPage data={landing} />
            </Box>
            <Box height='100vh' display="flex" flexDirection="column">
                <AboutPage data={about} />
            </Box>
            <Box height='100vh' display="flex" flexDirection="column" sx={{ alignContent: 'center' }}>
                <FAQPage />
            </Box>
            <Footer />
        </Box>
    </QueryClientProvider>
}