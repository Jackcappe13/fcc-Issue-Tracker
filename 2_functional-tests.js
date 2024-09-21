const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let firstIssue;
let secondIssue;

suite("Functional Tests", function () {
  suite("Integration tests with chai-http", function () {
    suite("POST request tests", function () {
      //#1 Create an issue with every field: POST request to /api/issues/{project}
      test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
        chai
          .request(server)
          .post("/api/issues/tests")
          .set("content-type", "application/json")
          .send({
            issue_title: "First Issue",
            issue_text: "Test",
            created_by: "freeCodeCamp",
            assigned_to: "Jack",
            status_text: "In progress",
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            firstIssue = res.body;
            assert.equal(res.body.issue_title, "First Issue");
            assert.equal(res.body.issue_text, "Test");
            assert.equal(res.body.created_by, "freeCodeCamp");
            assert.equal(res.body.assigned_to, "Jack");
            assert.equal(res.body.status_text, "In progress");
            done();
          });
      });
      //#2 Create an issue with only required fields: POST request to /api/issues/{project}
      test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .post("/api/issues/tests")
          .set("content-type", "application/json")
          .send({
            issue_title: "First Issue",
            issue_text: "Test",
            created_by: "freeCodeCamp",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            firstIssue = res.body;
            assert.equal(res.body.issue_title, "First Issue");
            assert.equal(res.body.issue_text, "Test");
            assert.equal(res.body.created_by, "freeCodeCamp");
            done();
          });
      });
      //#3 Create an issue with missing required fields: POST request to /api/issues/{project}
      test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .post("/api/issues/tests")
          .set("content-type", "application/json")
          .send({
            issue_title: "First Issue",
            issue_text: "Test",
            created_by: "freeCodeCamp",
            assigned_to: "",
            status_text: "",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            firstIssue = res.body;
            assert.equal(res.body.issue_title, "First Issue");
            assert.equal(res.body.issue_text, "Test");
            assert.equal(res.body.created_by, "freeCodeCamp");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            done();
          });
      });
    });
    suite("GET request tests", function () {
      //#4 View issues on a project: GET request to /api/issues/{project}
      test("View issues on a project: GET request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/issues/tests")
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
      //#5 View issues on a project with one filter: GET request to /api/issues/{project}
      test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/issues/tests")
          .query({ _id: firstIssue._id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_title, firstIssue.issue_title);
            assert.equal(res.body[0].issue_text, firstIssue.issue_text);
            done();
          });
      });
      //#6 View issues on a project with multiple filters: GET request to /api/issues/{project}
      test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .get("/api/issues/tests")
          .query({ _id: firstIssue._id, issue_title: firstIssue.issue_title })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].issue_title, firstIssue.issue_title);
            assert.equal(res.body[0].issue_text, firstIssue.issue_text);
            done();
          });
      });
    });
    suite("PUT request tests", function () {
      //#7 Update one field on an issue: PUT request to /api/issues/{project}
      test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/tests")
          .send({ _id: firstIssue._id, issue_title: "First issue updated" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, firstIssue._id);
            done();
          });
      });
      //#8 Update multiple fields on an issue: PUT request to /api/issues/{project}
      test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/tests")
          .send({
            _id: firstIssue._id,
            issue_title: "First issue updated",
            issue_text: "Text updated",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully updated");
            assert.equal(res.body._id, firstIssue._id);
            done();
          });
      });
      //#9 Update an issue with missing _id: PUT request to /api/issues/{project}
      test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/tests")
          .send({
            issue_title: "First issue updated",
            issue_text: "Text updated",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
      //#10 Update an issue with no fields to update: PUT request to /api/issues/{project}
      test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/tests")
          .send({
            _id: firstIssue._id,
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "no update field(s) sent");
            done();
          });
      });
      //#11 Update an issue with an invalid _id: PUT request to /api/issues/{project}
      test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/tests")
          .send({
            _id: "039409382049812309812093812098301298",
            issue_title: "First issue updated",
            issue_text: "Text updated",
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not update");
            done();
          });
      });
    });
    suite("DELETE request tests", function () {
      //#12 Delete an issue: DELETE request to /api/issues/{project}
      test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/tests")
          .send({ _id: firstIssue._id })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
      });
      //#13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
      test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/tests")
          .send({ _id: "039409382049812309812093812098301298" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "could not delete");
            done();
          });
      });
      //#14 Delete an issue with missing _id: DELETE request to /api/issues/{project}
      test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
        chai
          .request(server)
          .delete("/api/issues/tests")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "missing _id");
            done();
          });
      });
    });
  });
});
