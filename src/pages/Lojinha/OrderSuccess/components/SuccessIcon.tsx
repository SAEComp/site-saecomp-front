import React from 'react';
import festaIcon from '../../../../assets/lojinha-icons/perrys/festa.png';

const SuccessIcon: React.FC = () => {
    return (
        <div className="mx-auto flex items-center justify-center mb-4">
            <img 
                src={festaIcon} 
                alt="Perry Festa" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
            />
        </div>
    );
};

export default SuccessIcon;