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
import Verification from './pages/Verification.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import AiCulinary from './components/saffronSuggestion/AiCulinary.jsx';
import AiCosmetic from './components/saffronSuggestion/AiCosmetic.jsx';
import AiMedicinal from './components/saffronSuggestion/AiMedicinal.jsx';
import AiPregnancy from './components/saffronSuggestion/AiPregnancy.jsx';
import InitialWelcome from './components/InitialWelcome.jsx';

const App = () => {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<InitialWelcome/>}/>
        <Route path='/verification' element={<Verification/>}/>
        <Route path='/welcome' element={<WelcomePage/>}/>
        <Route path="/home" element={<Home />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/ai-suggestion" element={<AiSuggestion />} />
        <Route path="/ai-culinary" element={<AiCulinary />} />
        <Route path="/ai-cosmetic" element={<AiCosmetic />} />
        <Route path="/ai-medicinal" element={<AiMedicinal />} />
        <Route path="/ai-pregnancy" element={<AiPregnancy />} />
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
