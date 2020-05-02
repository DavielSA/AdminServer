
import ctrlHome from "./home/ctrl.home";
import ctrlUser from './users/ctrl.user';
import ctrlLangs from './langs/ctrl.langs';
import ctrlService from './services/ctrl.service';

const controllers: any[] = [
    ctrlHome.router,
    ctrlUser.router,
    ctrlLangs.router,
    ctrlService.router
];

export default controllers;
