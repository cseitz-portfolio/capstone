import { Box, Card, CardHeader, CardActions, CardProps, Checkbox, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Typography, CardContent, Button, ListItemIcon } from "@mui/material";
import { EventListResponse } from "pages/api/events";
import { EventResponse } from "pages/api/events/[id]";
import { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useAlert } from "./alert";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';

export function EventCard(props: {
    event: string;
} & CardProps) {
    const { event: id, ...cardProps } = props;
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const { isLoading, error, data } = useQuery<EventResponse>(['event', id], () => {
        if (id == 'create') {
            return {};
        }
        return fetch('/api/events/' + id).then(res => res.json())
    });
    const { event } = data || {};
    const hasType = Boolean(event?.type);
    const alert = useAlert();
    useEffect(() => {
        if(!isLoading){return;}
        alert.success({
            message: 'Loaded Event ' + event?.title || "[Missing title]",
            duration: 2000,
        })
    }, [isLoading]);
    if (isLoading) return <Card {...cardProps} />;
    return <>
        <Card { ...cardProps }>
            <CardHeader {...{
                title: <Box component="span" sx={{ }}>
                { event.title } - <Typography component="span" sx={{ }}>
                { hasType ? event.type : "no type" }
            </Typography>
            </Box>, 
                subheader: <Box component="span" sx={{ }}>
                { new Date(event.startsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    }) + " - " + new Date(event.endsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })}</Box>
            }} action={<IconButton>
                <MoreVertIcon />
            </IconButton>} />
            <CardContent>
                <Typography variant="h6">Description:</Typography>
                <Typography>{event.description}</Typography>
                <hr/>
                <List subheader={"Details"} dense>
                <ListItem>
                    <ListItemIcon>
                        <TodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Registered" secondary={new Date(event.created).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Updated" secondary={new Date(event.updated).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Last Edited By:" secondary={"PLACE HOLDER NAME"} />
                </ListItem>
            </List>
            </CardContent>
            <CardActions>
                <Button>EDIT</Button>
            </CardActions>
        </Card>
    </>
}

export function EventListItem(props: { event: string, onClick?: (event: string) => void }) {
    const { onClick = (event: string) => { }, } = props;
    const { isLoading, error, data } = useQuery<EventResponse>(['event', props.event], () => (
        fetch('/api/events/' + props.event).then(res => res.json())
    ));
    const { event } = data || {};
    if (isLoading) return <ListItem disablePadding />;
    const { title, description, startsAt, endsAt, type } = event;
    const hasType = Boolean(event.type);
    return <ListItem disablePadding onClick={() => onClick(event?.id)}>
        <ListItemButton dense>
        <ListItemText {...{
                primary: <>
                    {title}
                    <Typography component="span" sx={{ color: 'text.disabled', m: 1 }}>-</Typography>
                    <Typography component="span" sx={{  }}>{ hasType ? event.type : "no type" } </Typography>
                </>,
                primaryTypographyProps: { fontSize: 15 },
                secondary: <>
                    <Typography component="span" sx={{  }}>{new Date(startsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} - {new Date(endsAt).toLocaleString('en-us', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                    })} </Typography>
                </>
            }} />
        </ListItemButton>
    </ListItem>
}

const queryClient = new QueryClient();
function EventListComponent(props: {}) {
    const { isLoading, error, data, dataUpdatedAt } = useQuery<EventListResponse>(['events'], () => (
        fetch('/api/events').then(res => res.json())
    ));
    const [open, setOpen] = useState<string>(null)
    const { events } = data || { events: [] };
    const alert = useAlert();
    useEffect(() => {
        if (isLoading) return;
        alert.success({
            message: 'Loaded ' + events.length + ' Events',
        })
    }, [isLoading]);
    const firstLoad = useRef(true);
    useEffect(() => {
        if (isLoading) return;
        if (!firstLoad.current)
            alert.info({
                message: 'Refreshed at ' + new Date(dataUpdatedAt).toLocaleTimeString('en-us', { timeStyle: 'medium' }),
                duration: 1500,
                unique: 'eventListRefreshedAt'
            });
        firstLoad.current = false;
    }, [dataUpdatedAt])
    return <>
        <Modal open={Boolean(open)} onClose={() => setOpen(null)}>
            <Box sx={{ width: '100vw', maxWidth: 600, mx: 'auto', mt: '10vh' }}>
                {open && <EventCard event={open} />}
            </Box>
        </Modal>
        <List>
            {events.map(({ id }) => <EventListItem key={id} event={id} onClick={setOpen} />)}
        </List>
    </>
}

export function EventList(props: (Parameters<typeof EventListComponent>)[0]) {
    return <QueryClientProvider client={queryClient}>
        <EventListComponent {...props} />
    </QueryClientProvider>
}