const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {

  beforeEach((done) => {

    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("GET /users/signup", () => {

    it("should render a view with a sign up form", (done) => {
      request.get(`${base}signup`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Sign up");
        done();
      });
    });

  });

  describe("POST /users/signup", () => {
      it("should create a new user with valid values and redirect", (done) => {

        const options = {
          url: `${base}signup` ,
          form: {
            email: "user@bloc.com",
            password: "999999"
          }
        }

        request.post(options,
          (err, res, body) => {
            User.findOne({where: {email: "user@bloc.com"}})
            .then((user) => {
              expect(user.email).toBe("user@bloc.com");
              expect(user.id).toBe(1);
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });

        it("should not create a new user with invalid attributes and redirect", (done) => {
          request.post(
            {
              url: `${base}signup`,
              form: {
                email: "no",
                password: "1555"
              }
            },
            (err, res, body) => {
              User.findOne({where: {email: "no"}})
              .then((user) => {
                expect(user).toBeNull();
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });

      });

      describe("GET /users/signin", () => {

        it("should render a view with a sign in form", (done) => {
          request.get(`${base}signin`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Sign in");
            done();
          });
        });

      });


});
