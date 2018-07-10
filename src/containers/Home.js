import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Jumbotron } from "react-bootstrap";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import "./styles/Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      templates: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const templates = await this.templates();
      this.setState({ templates });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  templates() {
    return API.get("templates", "/templates");
  }

  renderTemplatesList(templates) {
    return [{}].concat(templates).map(
      (template, i) =>
        i !== 0
          ? <ListGroupItem
              key={template.templateId}
              href={`/templates/${template.templateId}`}
              onClick={this.handleNoteClick}
              className="template"
              header={template.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(template.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/templates/new"
              className="template"
              onClick={this.handleNoteClick}
            >
              <h4>
                <b>{"\uFF0B"}</b> Create a new template
              </h4>
            </ListGroupItem>
    );
  }

  handleNoteClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  }

  renderLander() {
    return (
      <Jumbotron className="jumbotron">
        <div className="lander">
          <h1>CloudFormation Bin</h1>
          <p><strong>Track and visualize virtual environment templates</strong></p>
          <div>
            <Link to="/login" className="btn btn-info btn-lg">
              Login
            </Link>
            <Link to="/signup" className="btn btn-success btn-lg">
              Signup
            </Link>
          </div>
        </div>
      </Jumbotron>
    );
  }

  renderTemplates() {
    return (
      <div className="templates">
        <PageHeader>Virtual Environments</PageHeader>
        <ListGroup className="templateList">
          {!this.state.isLoading && this.renderTemplatesList(this.state.templates)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderTemplates() : this.renderLander()}
      </div>
    );
  }
}
