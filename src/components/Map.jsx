import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Markers = ({ images, setViewer }) => {
    return images.map((img, idx) => (
        <React.Fragment key={idx}>
            {img.latitude && <Marker position={[img.latitude, img.longitude]}>
                <Popup>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <ListItem
                            alignItems="flex-start"
                        >
                            <ListItemAvatar>
                                <Avatar
                                    className='img-list'
                                    sx={{ width: 86, height: 86 }}
                                    alt={img.id}
                                    src={img.url}
                                    variant="rounded"
                                    onClick={() => setViewer(img)} />
                            </ListItemAvatar>
                            <ListItemText
                                className='text-list-info-popup'
                                onClick={() => setViewer(img)}
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            fontSize={20}
                                        >
                                            {img.image_annotationsFilter[0].label}
                                        </Typography>
                                        <Typography
                                            fontSize={17}
                                        >
                                            {img.monitoring_type}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {img.date_captured}
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'block' }}
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {img.anp}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </List>
                </Popup>
            </Marker>}
        </React.Fragment>
    ))
}

const Map = ({ imagesList, setViewer }) => {

    return (
        <>
            <MapContainer center={[22.0458888889, -100.545444444]} zoom={5} style={{ height: "50vh", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                    <Markers images={imagesList} setViewer={setViewer} />
                </MarkerClusterGroup>
            </MapContainer>
            <div className='map-warning'>Sólo se muestra un máximo de 1000 observaciones en la vista de mapa.</div>
        </>
    )
}

export default Map;