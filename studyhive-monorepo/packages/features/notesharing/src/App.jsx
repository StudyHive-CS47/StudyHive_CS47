import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import Header from '@shared/components/Header';
import Footer from '@shared/components/Footer';
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
