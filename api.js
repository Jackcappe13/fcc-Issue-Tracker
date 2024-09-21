"use strict";

const issueSchema = require("../schemes").Issue;
const projectSchema = require("../schemes").Project;
module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      let project = req.params.project;
      try {
        let currentProject = await projectSchema.findOne({ name: project });
        if (!currentProject) {
          return res.json([{ error: "cannot find any project" }]);
        } else {
          let currentIssues = await issueSchema.find({
            projectId: currentProject._id,
            ...req.query,
          });
          if (!currentIssues) {
            return res.json([{ error: "cannot find any issue" }]);
          }
          return res.json(currentIssues);
        }
      } catch (err) {
        res.json({ error: "cannot get any issue, try again", _id: _id });
      }
    })

    .post(async (req, res) => {
      let project = req.params.project;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: "required field(s) missing" });
      }
      try {
        let projectModel = await projectSchema.findOne({ name: project });
        if (!projectModel) {
          projectModel = new projectSchema({ name: project });
          projectModel = await projectModel.save();
        }
        let issueModel = new issueSchema({
          projectId: projectModel._id,
          issue_title: issue_title,
          issue_text: issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by,
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || "",
        });
        let issue = await issueModel.save();
        res.json(issue);
      } catch (err) {
        res.json({ error: "something went wrong try again", _id: _id });
      }
    })

    .put(async (req, res) => {
      let project = req.params.project;
      const _id = req.body._id;
      const issue_title = req.body.issue_title;
      const issue_text = req.body.issue_text;
      const created_by = req.body.created_by;
      const assigned_to = req.body.assigned_to;
      const status_text = req.body.status_text;
      const open = req.body.open;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        return res.json({ error: "no update field(s) sent", _id: _id });
      }
      try {
        let projectModel = await projectSchema.findOne({ name: project });
        if (!projectModel) {
          throw new Error("could not find any project");
        }
        let currentIssue = await issueSchema.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await currentIssue.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async (req, res) => {
      let project = req.params.project;
      const _id = req.body._id;
      if (!_id) {
        return res.json({ error: "missing _id" });
      }
      try {
        let projectModel = await projectSchema.findOne({ name: project });
        if (!projectModel) {
          throw new Error("could not find any project");
        }
        let deletedIssue = await issueSchema.deleteOne({
          _id: _id,
          projectId: projectModel._id,
        });
        if (deletedIssue.deletedCount === 0) {
          throw new Error("Could not find Id");
        }
        res.json({ result: "successfully deleted", _id: _id });
      } catch (err) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
};
