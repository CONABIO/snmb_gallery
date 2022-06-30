

const InfoBar = ({ totalItems }) => {

    return (
        <div className='info'>
            <p>Observaciones</p><p className='info-items'>{totalItems}</p>
        </div>
    )
}

export default InfoBar;