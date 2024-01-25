import React from 'react';
import NavigationDrawer from './NavigationDrawer';
import TimePicker from './TimePicker';
import './Timer.css';


export default function Timer() {
  return (
    <div className="home">
      <NavigationDrawer />
      <TimePicker />
    </div>
  );
}