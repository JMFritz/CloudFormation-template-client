import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Jumbotron, Row, Grid, Col, Thumbnail } from "react-bootstrap";
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
              className={"template" + i}
              header={template.content.trim().split("\n")[0]}
            >
              {"Created: " + new Date(template.createdAt).toLocaleString()}
            </ListGroupItem>
          : <ListGroupItem
              key="new"
              href="/templates/new"
              className="newtemplate"
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
      <div className="homePage">
        <Jumbotron className="jumbotron">
          <div className="lander">
            <p><strong>Store and visualize virtual environment templates</strong></p>
          </div>
        </Jumbotron>
        <div className="thumbnail-wrapper">
            <Thumbnail src={ require('./images/list-template-example.png') } alt="template example" className="thumbnails">
              <p>Create, store, and access multiple virtual environments</p>
            </Thumbnail>
            <Thumbnail src={ require('./images/template-example.png') } alt="list of templates" className="thumbnails">
              <p>Reference, update, and document each virtual environment individually</p>
            </Thumbnail>
        </div>
        <div className="content">
          <div className="about">
            <h3>About the Site</h3>
            <p>After learning about the power of CloudFormation and infrastructure as code, I noticed how difficult it may be for someone to view the YAML/JSON file and truly understand how the environment is connected. I began searching for web applications that would help a user visualize all the moving parts of a CloudFormation template, and came across <em>CloudCraft</em>.  The diagrams that I put together using CloudCraft helped me with my understanding of the key components that go into cloud infrastructure.</p>
            <p>By utlizing the <em>Serverless Framework</em> to build an API and <em>ReactJS</em> to build the user interface, I was able to create a simple web app where you can store your CloudFormation templates, diagrams, and any notes on the environment. A user can view the diagram, upload a revised template, and take notes for better understanding for each individual "template" object they create.</p>
            <div className="builtWith">
              <h4>Built with:</h4>
              <img src={ require('./images/aws-logo4.png') } />
              <img src={ require('./images/cloudcraft-logo.svg') } />
              <img src={ require('./images/react-logo.png') } />
              <img src={ require('./images/serverless-logo.png') } />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderTemplates() {
    return (
      <div className="templates">
        <PageHeader>Your Virtual Environments</PageHeader>
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
