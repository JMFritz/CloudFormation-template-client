import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { API } from "aws-amplify";
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
              header={template.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(template.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/templates/new"
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
      <div className="lander">
        <h1>CloudFormation Template</h1>
        <p>Track and visualize your CloudFormation Templates!</p>
      </div>
    );
  }

  renderTemplates() {
    return (
      <div className="templates">
        <PageHeader>Your Templates</PageHeader>
        <ListGroup>
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
