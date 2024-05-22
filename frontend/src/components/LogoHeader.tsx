import { Link } from 'react-router-dom';
import logo from '../assets/TransparentBanner.png';

export const LogoHeader = () => {
  return (
    <div className="flex items-center justify-between p-2 bg-transparent">
      <Link to="/" className="text-7xl font-bold text-white">
        <img src={logo} alt="ONCORE" className="h-24" />
      </Link>
    </div>
  );
};
