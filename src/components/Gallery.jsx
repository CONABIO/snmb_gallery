import React from 'react';
import Masonry from '@mui/lab/Masonry';
import Skeleton from '@mui/material/Skeleton';

const Gallery = ({ imagesList, loadedImg, removeSkeleton, setViewer }) => {
    return (
        <div>
            <Masonry
                className='masonry-box'
                columns={4}
                spacing={2}
                defaultHeight={650}
                defaultColumns={4}
                defaultSpacing={2}>
                {imagesList.map((image, index) => (
                    <React.Fragment key={index}>
                        {!loadedImg && <Skeleton variant="rectangular" animation="wave" className='skeleton-height' />}
                        <img
                            className='image-item'
                            style={{
                                display: `${loadedImg ? 'block' : 'none'}`
                            }}
                            src={image.url}
                            alt={image.id}
                            onLoad={() => removeSkeleton(index, imagesList.length)}
                            onClick={() => setViewer(image)} />
                    </React.Fragment>
                ))}
            </Masonry>
        </div>
    )
}

export default Gallery;