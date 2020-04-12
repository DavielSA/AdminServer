import app from './../../app';
import supertest from 'supertest';

const EmptyMessage: any = {
    "error": [],
    "warning": [],
    "info": [],
    "item": {}
};

describe("ctrl.home", () => {
    let request: any = null;
    beforeEach((done) => {
        request = supertest(app.app);
    });

    it("should return 200", async ()=> {
        const result = await request.get('/');
        console.log(result.status);
        expect(result.status).toBe(200);
    });
});
