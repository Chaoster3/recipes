import React, { useState } from 'react';

const PostModal = ({onPost, modalChange}) => {
    const [post, setPost] = useState("");

    const postChange = (event) => {
        setPost(event.target.value)
    }

    return (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

            <div className="modal-container bg-white w-11/12 md:max-w-md rounded-lg shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">

                    <div className="flex justify-between items-center pb-3">
                        <p className="text-xl font-bold">Add a Review</p>
                        <div className="modal-close cursor-pointer z-50">
                            <svg className="fill-current text-black" onClick={() => modalChange(false)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                            </svg>
                        </div>
                    </div>

                    <textarea className="w-full h-40 p-1 border border-gray-300 rounded-lg" placeholder='Write something about the recipe' onChange={postChange}/>


                    <div className="flex justify-center pt-2">
                        <button className="px-4 bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-700" onClick={() => onPost(post)}>Post</button>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default PostModal;