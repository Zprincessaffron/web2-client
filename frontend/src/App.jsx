import React from 'react';
import BeautyandSkincare from './components/BeautyandSkincare';
import MedicinalUsage from './components/MedicinalUsage';
import CulinaryUsage from './components/CulinaryUsage';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UseCases from './components/useCases/UseCases.jsx';
import IndianCuisine from "./components/IndianCuisine"
import EuropeanCuisine from './components/EuropeanCuisine';
import AmericanCuisine from './components/AmericanCuisine';
import AustralianCuisine from './components/AustralianCuisine';
import ArabianCuisine from './components/ArabianCuisine';
import JapaneseCuisine from './components/JapaneseCuisine';
import PregnantWomen from './components/PregnantWomen';
import AiSuggestion from './components/saffronSuggestion/AiSuggestion';

const App = () => {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/ai-suggestion" element={<AiSuggestion />} />
        <Route path="/culinary" element={<CulinaryUsage />} />
        <Route path="/cosmetic" element={<BeautyandSkincare />} />
        <Route path="/medicinal" element={<MedicinalUsage />} />
        <Route path="/pregnant-women" element={<PregnantWomen />} />
        <Route path="/indian-cuisine" element={<IndianCuisine/>} />
        <Route path="/european-cuisine" element={<EuropeanCuisine />} />
        <Route path="/american-cuisine" element={<AmericanCuisine/>} />
        <Route path="/australian-cuisine" element={<AustralianCuisine/>} />
        <Route path="/arabian-cuisine" element={<ArabianCuisine/>} />
        <Route path="/japanese-cuisine" element={<JapaneseCuisine/>} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
