import '../../../styles/global.scss'
import { useContext, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import DotsModal from '../../interface/dots/dots'
import Block from '../../interface/block/block'
import { ThemeContext } from '../../theme/ThemeProvider'

export default function TaskList({ newTask, target, setNewTask, decTask, deletedTask, complitedTaskN, countTask }) {
    const [active, setActive] = useState(false)
    const refEdit = useRef([])
    const refCheckbox = useRef([])
    const {type} = useContext(ThemeContext)

    const emptyTask = newTask.filter(item => {
        if (item.category === target) {
            return item.complited === false
        } else {
            return null
        }
    })

    const emptyComplitedTask = newTask.filter(item => {
        if (item.category === target) {
            return item.complited === true
        } else {
            return null
        }
    })

    const clearTasks = () => {
        const changedTasks = newTask.filter(item => {
            return item.category !== target
        })
        setNewTask(changedTasks)
    }
    return (
        <Block 
            className={'task'}
            title={'Активные задачи'}
            dots={
                <DotsModal
                    active={active}
                    setActive={setActive}
                    child={'Очистить категорию'}
                    someFunc={clearTasks}/>
            }
        >
            <div className='task__active'>
                {emptyTask.length > 0 ? (
                    <TransitionGroup className='task__group'>
                        {newTask.map((item, index) => {
                            const { category, task, complited, id } = item
                            if (target === category && !complited) {
                                return (
                                    <CSSTransition
                                        classNames='item'
                                        key={id}
                                        timeout={300}>
                                        <div 
                                            key={id} 
                                            className={type === 'light' ? 'task__active-item' : 'task__active-item dark'}>
                                            <input
                                                className='task__input'
                                                type="checkbox"
                                                checked={false}
                                                ref={el => refCheckbox.current[index] = el}
                                                onChange={() => {
                                                    const changedTask = newTask.map((item) => {
                                                        return item.id === id ? { ...item, complited: !complited } : item
                                                    })
                                                    countTask(++complitedTaskN)
                                                    setNewTask(changedTask)
                                                }} />
                                            <span
                                                className='task__text-content'
                                                ref={el => refEdit.current[index] = el}
                                                onChange={() => {
                                                    console.log('Прифки')
                                                }}>
                                                    {task}
                                            </span>
                                            <button className={type === 'light' ? 'task__edit' : 'task__edit dark'}
                                                onClick={() => {
                                                    const currentTask = refEdit.current[index]
                                                    const currentCheckbox = refCheckbox.current[index]
                                                    if(currentTask.classList.contains('active')){

                                                        const editedTask = newTask.filter((el, i) => {
                                                            if(index === i){
                                                                return el.task = currentTask.textContent
                                                            } else {
                                                                return null
                                                            }
                                                        })

                                                        if(!editedTask[0]){
                                                            currentTask.classList.add('warn')
                                                            currentTask.focus()
                                                        }else if(editedTask[0].task.length >= 50){
                                                            currentTask.classList.add('warn')
                                                            currentTask.focus()
                                                        }else {
                                                            const editedArr = newTask.map(el => {
                                                                if(el.id === editedTask[0].id){
                                                                    el = editedTask[0]
                                                                }
                                                                return el
                                                            }) 
                                                            setNewTask(editedArr)
                                                            currentTask.contentEditable = false
                                                            currentTask.classList.remove('warn')
                                                            currentTask.classList.remove('active')
                                                            currentCheckbox.classList.remove('inactive')
                                                        }
                                                    }else {
                                                        currentTask.contentEditable = true
                                                        currentTask.focus()
                                                        currentTask.classList.add('active')
                                                        currentCheckbox.classList.add('inactive')
                                                    }
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_1052_135)">
                                                    <path className='ico' fillRule="evenodd" clipRule="evenodd" d="M1.54159 3.04159C1.92839 2.6548 2.45299 2.4375 3 2.4375H8.25C8.56066 2.4375 8.8125 2.68934 8.8125 3C8.8125 3.31066 8.56066 3.5625 8.25 3.5625H3C2.75136 3.5625 2.5129 3.66127 2.33709 3.83709C2.16127 4.0129 2.0625 4.25136 2.0625 4.5V15C2.0625 15.2486 2.16127 15.4871 2.33709 15.6629C2.5129 15.8387 2.75136 15.9375 3 15.9375H13.5C13.7486 15.9375 13.9871 15.8387 14.1629 15.6629C14.3387 15.4871 14.4375 15.2486 14.4375 15V9.75C14.4375 9.43934 14.6893 9.1875 15 9.1875C15.3107 9.1875 15.5625 9.43934 15.5625 9.75V15C15.5625 15.547 15.3452 16.0716 14.9584 16.4584C14.5716 16.8452 14.047 17.0625 13.5 17.0625H3C2.45299 17.0625 1.92839 16.8452 1.54159 16.4584C1.1548 16.0716 0.9375 15.547 0.9375 15V4.5C0.9375 3.95299 1.1548 3.42839 1.54159 3.04159Z"/>
                                                    <path className='ico' fillRule="evenodd" clipRule="evenodd" d="M15 1.97156C14.7272 1.97156 14.4656 2.07992 14.2727 2.2728L7.25791 9.28763L6.77308 11.227L8.71242 10.7421L15.7272 3.7273C15.9201 3.53442 16.0285 3.27282 16.0285 3.00005C16.0285 2.72728 15.9201 2.46568 15.7272 2.2728C15.5344 2.07992 15.2728 1.97156 15 1.97156ZM13.4772 1.4773C13.8811 1.07344 14.4289 0.846558 15 0.846558C15.5711 0.846558 16.1189 1.07344 16.5227 1.4773C16.9266 1.88116 17.1535 2.42891 17.1535 3.00005C17.1535 3.57119 16.9266 4.11894 16.5227 4.5228L9.39774 11.6478C9.32565 11.7199 9.23533 11.771 9.13642 11.7958L6.13642 12.5458C5.94474 12.5937 5.74196 12.5375 5.60225 12.3978C5.46254 12.2581 5.40637 12.0553 5.45429 11.8636L6.20429 8.86362C6.22902 8.76472 6.28016 8.67439 6.35225 8.6023L13.4772 1.4773Z"/>
                                                    </g>
                                                    <defs>
                                                    <clipPath id="clip0_1052_135">
                                                    <rect width="18" height="18" fill="white"/>
                                                    </clipPath>
                                                    </defs>
                                                </svg>
                                            </button>
                                            <button className='task__trash'
                                                onClick={() => {
                                                    const changedTask = newTask.filter((item) => {
                                                        return item.id !== id
                                                    })
                                                    setNewTask(changedTask)
                                                    decTask(++deletedTask)
                                                }} 
                                            />
                                        </div>
                                    </CSSTransition>
                                )
                            } else {
                                return null
                            }
                        })}
                    </TransitionGroup>
                ) : (
                    <CSSTransition classNames='block' timeout={300}>
                        <div className='task__active-empty empty'>
                            <span>Нет активных задач</span>
                        </div>
                    </CSSTransition>
                )}
            </div>
            <div className='task__complited-title'>
                <h1>Завершенные задачи</h1>
            </div>
            <div className='task__completed'>
                {emptyComplitedTask.length > 0 ? (
                    <TransitionGroup>
                        {newTask.map((item) => {
                            const { category, task, complited, id } = item
                            if (target === category && complited) {
                                return (
                                    <CSSTransition
                                        classNames='item'
                                        key={id}
                                        timeout={300}>
                                        <div className={type === 'light' ? 'task__active-item' : 'task__active-item dark'}>
                                            <input
                                                className='task__input'
                                                type="checkbox"
                                                checked={true}
                                                onChange={() => {
                                                    const changedTask = newTask.map((item) => {
                                                        return item.id === id ? { ...item, complited: !complited } : item
                                                    })
                                                    countTask(--complitedTaskN)
                                                    setNewTask(changedTask)
                                                }}
                                            />
                                            <span className='task__text-content' style={{ textDecoration: 'line-through' }}>
                                                {task}
                                            </span>
                                            <button className='task__trash' onClick={() => {
                                                const changedTask = newTask.filter((item) => {
                                                    return item.id !== id
                                                })
                                                setNewTask(changedTask)
                                                decTask(++deletedTask)
                                                countTask(--complitedTaskN)
                                            }}>
                                            </button>
                                                </div>
                                    </CSSTransition>
                                )
                            }
                        })}
                    </TransitionGroup>
                ) : (
                    <div className='task__complited-empty empty'>
                        <span>Нет завершённых задач</span>
                    </div>
                )}
            </div>
        </Block>
    )
}