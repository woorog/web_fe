import React, { useState, useEffect } from 'react';
import { Fab, Action } from 'react-tiny-fab';
import './style.scss';
import { MdAdd } from 'react-icons/md';
import {
  mainButtonStyles,
  actionButtonStyles,
  style,
} from './styles/fabStyles';
import {
  handleCameraOnClick,
  handleProblemOnClick,
  handleCanvasOnClick,
  handleChatOnClick,
  handleEditorOnClick,
  someFunctionForTheMainButton,
} from './handlers';

const MyFab: React.FC = () => {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (selectedActions.length > 0) {
        selectedActions.forEach((action) => {
          switch (action) {
            case 'Problem':
              handleProblemOnClick();
              break;
            case 'Canvas':
              handleCanvasOnClick();
              break;
            case 'Editor':
              handleEditorOnClick();
              break;
            case 'Chat':
              handleChatOnClick();
              break;
            case 'Camera':
              handleCameraOnClick();
              break;
            default:
              break;
          }
        });
        setSelectedActions([]);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedActions]);

  const handleActionClick = (action: string) => {
    setSelectedActions((prev) => {
      if (prev.includes(action)) {
        return prev.filter((a) => a !== action);
      } else if (prev.length < 2) {
        return [...prev, action];
      }
      return prev;
    });
  };

  const isSelected = (action: string) => selectedActions.includes(action);

  return (
    <Fab
      mainButtonStyles={mainButtonStyles}
      style={style}
      icon={<MdAdd />}
      event="hover"
      alwaysShowTitle={true}
      onClick={someFunctionForTheMainButton}
    >
      <Action
        text="Problem"
        onMouseDown={() => handleActionClick('Problem')}
        style={{
          ...actionButtonStyles,
          backgroundColor: isSelected('Problem')
            ? '#000000'
            : actionButtonStyles.backgroundColor,
        }}
      />
      <Action
        text="Canvas"
        onMouseDown={() => handleActionClick('Canvas')}
        style={{
          ...actionButtonStyles,
          backgroundColor: isSelected('Canvas')
            ? '#000000'
            : actionButtonStyles.backgroundColor,
        }}
      />
      <Action
        text="Editor"
        onMouseDown={() => handleActionClick('Editor')}
        style={{
          ...actionButtonStyles,
          backgroundColor: isSelected('Editor')
            ? '#000000'
            : actionButtonStyles.backgroundColor,
        }}
      />
      <Action
        text="Chat"
        onMouseDown={() => handleActionClick('Chat')}
        style={{
          ...actionButtonStyles,
          backgroundColor: isSelected('Chat')
            ? '#000000'
            : actionButtonStyles.backgroundColor,
        }}
      />
      <Action
        text="Camera"
        onMouseDown={() => handleActionClick('Camera')}
        style={{
          ...actionButtonStyles,
          backgroundColor: isSelected('Camera')
            ? '#000000'
            : actionButtonStyles.backgroundColor,
        }}
      />
      <i className="fa fa-help" />
    </Fab>
  );
};

export default MyFab;
