import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as Refresh } from '../../assets/icons/Refresh_icon.svg';
import { useNavigate, useParams } from 'react-router-dom';
import uuid from 'react-uuid';

interface Props {
  isShowing: boolean;
  setIsShowing: (isShowing: boolean) => void;
}

export const InviteModal = ({ isShowing, setIsShowing }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setIsShowing(false);
        }, 2000); // Show message for 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy URL:", error);
      });
  }, [setIsShowing]);

  useEffect(() => {
    if (isShowing) {
      handleCopy();
    }
  }, [isShowing, handleCopy]);

  const handleChange = useCallback(() => {
    const newPath = btoa(uuid());
    localStorage.setItem(`problem${id}`, newPath);
    navigate(`/problem/multi/${id}/${newPath}`);
    navigate(0);
  }, [id, navigate]);

  return isShowing ? (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-220 h-12 z-50 border border-gray-300 rounded-lg shadow-md p-4 flex flex-col justify-center items-center">
      {copySuccess && (
        <div className="text-sublime-orange text-center">
          URL copied to clipboard!
        </div>
      )}
    </div>
  ) : null;
};
