import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.scss'

import Spinner, { ISpinnerProps } from '@components/common/Spinner'
import SignInScreen from '@components/AuthScreens/SignIn'
import NotFound from '@components/NotFound'

import { AppLangContext, AppStateContext } from '@Contexts'
import baseVars from './vars.json'
import baseLang from './lang-en.json'
import PurchaseScreen from '@components/PurchaseScreen'
import SalesScreen from '@components/SalesScreen'
import Inventory from '@components/InventoryScreen'
import ItemsScreen from '@components/ItemsScreen'
import ItemList from '@components/ItemsScreen/ItemsList/ItemList'

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
          appConfig: baseVars,
          loading: loaderProps.loading,
          setLoader: handleLoaderChange,
        }}
      >
        <AppLangContext.Provider value={{ appLang: baseLang }}>
          <Router>
            <div className="app-container">
              <Routes>
                <Route path="/purchase" element={<PurchaseScreen />} />
                <Route
                  path={baseVars['feature.auth.routes'].signIn}
                  element={<SignInScreen />}
                />
                
                <Route path="/salesorder" element={<SalesScreen />} />
                <Route path="/inventory" element={< Inventory/>} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/items/create" element={<ItemsScreen />} />
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
