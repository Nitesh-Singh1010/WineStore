import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.scss'
import Spinner, { ISpinnerProps } from '@components/common/Spinner'
import HomeScreen from '@components/HomeScreen'
import NotFound from '@components/NotFound'
import { AppLangContext, AppStateContext } from '@Contexts'
import baseVar from './vars.json'
import baseLang from './lang-en.json'
import ItemsScreen from '@components/ItemsScreen'
import ItemList from '@components/ItemsList/ItemList'
import { Inventory } from '@mui/icons-material'

export interface INavItem {
  disabled?: boolean
  icon: string
  route: string
  title: string
}

interface ILoaderProps extends ISpinnerProps {
  loading: boolean
}

const App: React.FC = () => {
  const [loaderProps, setLoaderProps] = useState<ILoaderProps>({
    loading: false,
  })

  const handleLoaderChange = (loading: boolean, label?: string) => {
    setLoaderProps({ loading, label: label ? label : undefined })
  }

  return (
    <React.StrictMode>
      {loaderProps.loading && <Spinner label={loaderProps.label} />}
      <AppStateContext.Provider
        value={{
          appConfig: baseVar,
          loading: loaderProps.loading,
          setLoader: handleLoaderChange,
        }}
      >
        <AppLangContext.Provider value={{ appLang: baseLang }}>
          <Router>
            <div className="app-container">
              <Routes>
                <Route path="/" element={<HomeScreen/>} />
                <Route path="/item" element={<ItemsScreen/>} />
                <Route path="/item/list" element={<ItemList/>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </AppLangContext.Provider>
      </AppStateContext.Provider>
    </React.StrictMode>
  )
}

export default App
