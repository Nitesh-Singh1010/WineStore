import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import MuiDrawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import * as MuiIcons from '@mui/icons-material'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { INavItem } from '../../App'
import { AppStateContext, IAppStateContext } from '@Contexts'

const drawerWidth = '20vw'

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1.45),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  position: 'relative',
  display: 'flex',
  top: 0,
  left: 0,
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& > .MuiDrawer-paper': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '& > .MuiDivider-root': {
      borderColor: 'inherit',
    },
    '& .MuiIconButton-root, & .MuiListItemButton-root > *': {
      color: theme.palette.primary.contrastText,
    },
    '& .Mui-selected': {
      backgroundColor: theme.palette.primary.contrastText,
      '& > *': {
        color: theme.palette.primary.main,
      },
    },
  },
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

const SideDrawer = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { appConfig } = useContext<IAppStateContext>(AppStateContext)
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Drawer
      className="side-drawer-container"
      variant="permanent"
      open={open}
      hideBackdrop={false}
    >
      <DrawerHeader>
        <IconButton onClick={toggleDrawer}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <MenuIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {appConfig['feature.common.navbar.routes.list'].map(
          (navItem: INavItem, index: number) => {
            const IconComponent = (MuiIcons as any)[navItem.icon]
            return (
              !navItem.disabled && (
                <ListItem
                  key={`nav-item-${index}`}
                  disablePadding
                  sx={{ display: 'block' }}
                >
                  <ListItemButton
                    onClick={() =>
                      location.pathname !== navItem.route
                        ? navigate(navItem.route)
                        : ''
                    }
                    selected={location.pathname === navItem.route}
                    title={navItem.title}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {<IconComponent />}
                    </ListItemIcon>
                    <ListItemText
                      primary={navItem.title}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              )
            )
          }
        )}
      </List>
    </Drawer>
  )
}

export default SideDrawer
