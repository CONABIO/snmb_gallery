import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import LocationOnIcon from '@mui/icons-material/LocationOn';


const ListItems = ({ imagesList, loadedImg, removeSkeleton, setViewer }) => {
    return (
        <div className='list-container'>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {imagesList.map((image, index) => (
                    <React.Fragment key={index}>
                        <ListItem 
                            alignItems="flex-start"
                            secondaryAction={
                                <IconButton edge="end" aria-label="comments" onClick={() => setViewer(image.url)} >
                                  <ImageSearchIcon />
                                </IconButton>
                            }
                            >
                            <ListItemAvatar>
                                <Avatar 
                                    className='img-list'
                                    sx={{ width: 86, height: 86 }}
                                    alt={image.id}
                                    src={image.url}
                                    variant="rounded"
                                    onClick={() => setViewer(image.url)} />
                            </ListItemAvatar>
                            <ListItemText
                                className='text-list-info'
                                onClick={() => setViewer(image.url)}
                                primary={
                                    <React.Fragment>
                                        <Typography
                                            fontSize={20}
                                        >
                                            {image.image_annotationsFilter[0].label}
                                        </Typography>
                                    </React.Fragment>
                                }
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {image.date_captured}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                            <ListItemText
                                primary={
                                    <div className='location'>
                                        <LocationOnIcon className="location-icon" />
                                        <Typography
                                            fontSize={15}
                                            color="text.secondary"
                                        >
                                            {image.latitude.toFixed(6) + ", " + image.longitude.toFixed(6)}
                                        </Typography>
                                    </div>
                                }
                            />
                        </ListItem>
                        <Divider className="divider-margin" variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List >
        </div>
    )
}

export default ListItems;