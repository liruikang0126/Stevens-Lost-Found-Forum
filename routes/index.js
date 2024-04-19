import postRoutes from './posts.js';
import userRoutes from './users.js';
import itemRoutes from './items.js';
//import authenticationRoute from './authentication.js';

const constructorMethod = (app) => {
    app.use('/posts', postRoutes);
    app.use('/users', userRoutes);
    app.use('/items', itemRoutes);

    //TODO: check below to be edited
    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not found'});
    });
};

export default constructorMethod;