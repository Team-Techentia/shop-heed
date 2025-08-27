const ListItemBullet = ({style, title}) => {
   return (<li style={{ listStyleType: 'none', display: 'flex', alignItems: 'center' }}>
    <span style={{ color: 'black', fontSize: '1.2em', marginRight: '8px' }}>•</span>{title}
    </li>)
}

export  default ListItemBullet;