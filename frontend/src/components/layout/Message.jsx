import styles from './Message.module.css';
import { useEffect, useState } from 'react';
import bus from '../../utils/bus';


function Message()
{
    const [visibility, setVilibility] = useState(false);
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {

        bus.addListener('flash', ({message, type}) => {
            setVilibility(true);
            setType(type);
            setMessage(message);


            setTimeout(() => {
                setVilibility(false)
            }, 3000);

        })


    }, [])


    return(
        visibility && (
            <div className={`${styles.message} ${styles[type]}`}>
                {message}
            </div>
        )
    )   
}

export default Message;