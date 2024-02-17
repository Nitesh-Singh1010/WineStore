import './HomeScreen.scss'

const HomeScreen = () => {
  const logApiErrors = (err: any) => {
    const errMessage = err.message as string
    if (
      err instanceof SyntaxError ||
      err instanceof TypeError ||
      err instanceof RangeError ||
      err instanceof ReferenceError
    ) {
      // Create error toast here for UI error
    } else {
      // Create error toast with custom or server message here
    }
  }

  return 'Hello world!!'
}

export default HomeScreen
