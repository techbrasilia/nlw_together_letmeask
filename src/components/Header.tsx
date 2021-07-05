import { Button } from '../components/Button';
import  { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useEffect } from 'react';
import { useState } from 'react';

type RoomProps = {
    roomId: string;
}

export function Header({ roomId }: RoomProps) {
    const { user } = useAuth();
    const { room } = useRoom(roomId);
    const history = useHistory();
    const routeMatch = useRouteMatch("/admin/rooms");
    const [isRouteAdmin, setIsRouteAdmin] = useState(false);

    useEffect(() => {
        if (routeMatch && user?.id === room?.authorId) {
            setIsRouteAdmin(true)
        }else{
            setIsRouteAdmin(false)
        }

    },[routeMatch, user, room])

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    function goToHome() {
        history.push('/');
    }

    return (
        <header>
            <div className="content">
                <img onClick={goToHome} src={logoImg} alt="Letmeask"/>
                <div>
                    <RoomCode code={roomId} />
                    {isRouteAdmin && (
                        <Button 
                        isOutlined 
                        onClick={handleEndRoom}
                        >Encerrar sala</Button>
                    )}
                </div>
            </div>
        </header>
    )
}