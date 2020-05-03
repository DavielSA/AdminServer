
import ctrlHome from "./home/ctrl.home";
import ctrlUser from './users/ctrl.user';
import ctrlLangs from './langs/ctrl.langs';
import ctrlService from './services/ctrl.service';
import ctrlPosts from './posts/ctrl.posts';

const controllers: any[] = [
    ctrlHome.router,
    ctrlUser.router,
    ctrlLangs.router,
    ctrlService.router,
    ctrlPosts.router
];

export default controllers;
