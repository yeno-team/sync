
import { Router } from 'express';
import { Logger } from 'src/server/modules/logger/logger';
import { IExecuteable } from 'src/types/IExecuteable';
import { LoadRoutesParams, RouteUtility } from './routes';
import MockRoute from './__mock__/route';

jest.mock('./__mock__/route');

afterEach(() => {
    jest.clearAllMocks();
})

describe("RouteUtility", () => {
    describe("#loadRoutes", () => {
        const routeUtility = new RouteUtility({
            readdir: jest.fn(() => [
                "./__mock__/route"
            ]),
            pathJoin: jest.fn((routesPath, route) => route)
        });
        
        it('should call execute method on all the routes in the param route directory', async () => {
            const params: LoadRoutesParams = {
                routesPath: "./__mock__",
                router: jest.fn() as any as Router,
                parentDependencies: {}
            };

            const mockRoutes: IExecuteable[] = await routeUtility.loadRoutes(params);
            const mockRoute = await mockRoutes[0];
            const mockExecute = mockRoute.execute as any as jest.Mock;
            
            expect(mockExecute.mock.calls.length).toBe(1);
        });

        it('should pass down Router and Parent Dependencies down to all routes', async () => {
            const mockParentDependencies = {
                test: "mock"
            };

            const mockRouter = jest.fn() as any as Router;

            const params: LoadRoutesParams = {
                routesPath: "./__mock__",
                router: mockRouter,
                parentDependencies: mockParentDependencies
            };

            await routeUtility.loadRoutes(params);

            expect(MockRoute).toHaveBeenCalledWith({router: mockRouter}, mockParentDependencies);
        });
    });
});