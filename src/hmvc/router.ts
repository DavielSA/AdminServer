
import ctrlHome from "./home/ctrl.home";
import ctrlUser from './users/ctrl.user';
import ctrlLangs from './langs/ctrl.langs';

const controllers: any[] = [
    ctrlHome.router,
    ctrlUser.router,
    ctrlLangs.router
];

export default controllers;
