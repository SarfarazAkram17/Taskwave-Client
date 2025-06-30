import React from 'react';
import { Link } from 'react-router';

const TaskCard= ({task}) => {
    return (

            <div className='p-5 rounded-lg bg-base-100 border-2 border-gray-200 shadow-md space-y-4'>
            <h1 className='font-bold text-xl'>{task.title}</h1>
            <p className='text-xs font-semibold'>{task.category}</p>
            <p className='text-xs'><strong>Deadline: </strong>{task.deadline}</p>
            <Link to={`/taskDetails/${task._id}`}>
               <button className='btn btn-info rounded-full font-bold px-8 text-lg'>See Details</button>            
            </Link>
        </div>

    );
};

export default TaskCard;