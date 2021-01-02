import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import SideBar from '../components/SideBar';
import Home from './Home';
import Dashboard from './Dashboard';
import Bodas from './Bodas';
import AddStage from './AddStage';
import AddBoda from './AddBoda';
import EditBoda from './EditBoda';

const HomeScreenRouter = createDrawerNavigator(
  {
    Home: { screen: Home },
    Bodas: { screen: Bodas },
    Dashboard: { screen: Dashboard },
    AddStage: { screen: AddStage },
    AddBoda: { screen: AddBoda },
    EditBoda: { screen: EditBoda },
  },
  {
    contentComponent: (props) => <SideBar {...props} />,
    initialRouteName: 'Home',
  }
);

export default createAppContainer(HomeScreenRouter);
