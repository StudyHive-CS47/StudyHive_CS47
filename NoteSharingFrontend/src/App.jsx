import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import Header from '../src/components/common/Header/Header.jsx';
import Footer from './components/common/Footer';
import Tabs from './components/common/Tabs';
import BrowsePage from './pages/BrowsePage';
import UploadPage from './pages/UploadPage';
import MyNotesPage from './pages/MyNotesPage';

const App = () => {
    return (
        <>
            <Header />
            <Tabs />

            <Footer />
        </>
    );
};

export default App;
