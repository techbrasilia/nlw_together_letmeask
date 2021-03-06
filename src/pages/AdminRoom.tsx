import { useParams } from 'react-router';


import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import  { Question } from '../components/Question';
import  { Header } from '../components/Header';

import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParams>()
    const roomId = params.id;
    const { questions, title} = useRoom(roomId);
    
    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    return (
        <div id="page-room">
            
            <Header roomId={roomId} />

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
               
                <div className="quetion-list">
                    {questions.map(question => {
                        return (
                            <Question 
                            key={question.id}
                            content={question.content} 
                            author={question.author}
                            isHighlighted={question.isHighlighted}
                            isAnswered={question.isAnswered}
                            >
                                {!question.isAnswered && (
                                    <>
                                    <button
                                    type="button"
                                    onClick={() => handleCheckQuestionAnswered(question.id)}>
                                        <img src={checkImg} alt="Marcar pergunta como respondida"/>
                                    </button>
                                    
                                    <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}>
                                        <img src={answerImg} alt="Destacar pergunta"/>
                                    </button>
                                    </>
                                )}

                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>
                                </button>
                            </Question>
                        )
                    })}
                </div>
           

            </main>
        </div>
    )
}