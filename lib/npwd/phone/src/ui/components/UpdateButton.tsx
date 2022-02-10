import React from 'react';


interface ProfileUpdateButtonProps {
  handleClick: () => void;
}

export const ProfileUpdateButton: React.FC<ProfileUpdateButtonProps> = ({ handleClick }) => {

  return (
    <div >
      <div onClick={handleClick}>
        {/*<PublishIcon />*/}
      </div>
    </div>
  );
};

export default ProfileUpdateButton;
