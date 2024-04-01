import { Visibility, VisibilityOff } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'

import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './SignIn.scss'
import {
  AppLangContext,
  AppStateContext,
  IAppLangContext,
  IAppStateContext,
} from '@Contexts'

interface ISignInScreenProps {}

const SignInScreen: React.FC<ISignInScreenProps> = ({}) => {
  const { appLang } = useContext<IAppLangContext>(AppLangContext)
  const { appConfig } = useContext<IAppStateContext>(AppStateContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleFormFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleShowPasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // eslint-disable-next-line no-console
    console.log(formData)
    // TO DO : Move to context later
    navigate('/Dashboard', { state: { username: formData.email } })
  }

  return (
    <div className="sign-in-screen-wrapper">
      <Card>
        <CardContent>
          <div className="product-title">
            <img src="./favicon.png" alt="XWines" loading="lazy" />
            <span>{appLang['feature.app.productName.text']}</span>
          </div>
          <h3 className="form-title">
            {appLang['feature.authScreen.form.signIn.title.text']}
          </h3>
          <form autoComplete="off" onSubmit={handleFormSubmission}>
            <div className="form-fields">
              <TextField
                autoComplete="off"
                fullWidth
                InputLabelProps={{ shrink: true }}
                label={
                  appLang['feature.authScreen.signInForm.formField.email.label']
                }
                name="email"
                placeholder={
                  appLang[
                    'feature.authScreen.signInForm.formField.email.placeholder'
                  ]
                }
                required
                type="text"
                value={formData.email || ''}
                variant="outlined"
                onChange={handleFormFieldChange}
              />
              <TextField
                autoComplete="off"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPasswordToggle}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
                label={
                  appLang[
                    'feature.authScreen.signInForm.formField.password.label'
                  ]
                }
                name="password"
                placeholder={
                  appLang[
                    'feature.authScreen.signInForm.formField.password.placeholder'
                  ]
                }
                required
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                variant="outlined"
                onChange={handleFormFieldChange}
              />
            </div>
            <div className="form-actions">
              <Link
                component="button"
                underline="none"
                onClick={() =>
                  navigate(appConfig['feature.auth.routes'].forgotPassword)
                }
              >
                {
                  appLang[
                    'feature.authScreen.signInForm.formActions.forgotPasswordLink.text'
                  ]
                }
              </Link>
              <Button type="submit" variant="contained">
                {
                  appLang[
                    'feature.authScreen.signInForm.formActions.signInButton.text'
                  ]
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <span>
            {
              appLang[
                'feature.authScreen.signInForm.footer.doNotHaveAnAccount.title.text'
              ]
            }
          </span>
          <Link
            component="button"
            underline="none"
            onClick={() => navigate(appConfig['feature.auth.routes'].signUp)}
          >
            {appLang['feature.authScreen.signInForm.footer.signUpLink.text']}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInScreen
