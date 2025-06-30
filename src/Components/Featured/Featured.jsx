import React, { useEffect, useState } from 'react';
import TaskCard from '../TaskCard/TaskCard';

const Featured = () => {
    const [tasks, setTasks] = useState([])
    useEffect(()=>{
        fetch('https://assignment-10-sarfaraz-akram.vercel.app/featuredTasks')
         .then(res => res.json())
         .then(data => setTasks(data))
    },[])
    return (
        <div className='my-12 px-4'>
            <h1 className='text-center mb-12 font-bold text-4xl md:text-5xl'>Featured Tasks</h1>
           
           <div className='grid grid-cols-1 gap-4 max-w-5xl mx-auto md:grid-cols-2 lg:grid-cols-3'>
             {tasks.map(task=> <TaskCard task={task} key={task._id}></TaskCard>)}

           </div>
                   </div>
    );
};

export default Featured;