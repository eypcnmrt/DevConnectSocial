import React from 'react';

interface HeaderProps {
  title: string;
  bgImage?: string;
}

const Header: React.FC<HeaderProps> = ({ title, bgImage }) => {
  return (
    <div
      className="text-white py-4 text-center h-full bg-cover bg-center"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : {}}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
};

export default Header;
