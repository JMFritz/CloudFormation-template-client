import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./styles/Templates.css";

export default class Templates extends Component {
  constructor(props) {
    super(props);

    this.file = null;
    this.diagram = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      template: null,
      content: "",
      attachmentURL: null,
      diagramURL: null
    };
  }

  async componentDidMount() {
    try {
      let attachmentURL;
      let diagramURL;
      const template = await this.getTemplate();
      const { content, attachment, diagram } = template;

      if (attachment) {
        attachmentURL = await Storage.vault.get(attachment);
      }

      if (diagram) {
        diagramURL = await Storage.vault.get(diagram);
      }

      this.setState({
        template,
        content,
        attachmentURL,
        diagramURL
      });
    } catch (e) {
      alert(e);
    }
  }

  getTemplate() {
    return API.get("templates", `/templates/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a file smaller than 5MB");
      return;
    }

    this.setState({ isLoading: true });
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this template?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });
  }

  render() {
    return (
      <div className="Templates">
        {this.state.template &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>
            {this.state.template.attachment &&
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.attachmentURL}
                  >
                    {this.formatFilename(this.state.template.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="file">
              {!this.state.template.attachment &&
                <ControlLabel>Attachment</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>



            {this.state.template.diagram &&
              <FormGroup>
                <ControlLabel>Diagram</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={this.state.diagramURL}
                  >
                    {this.formatFilename(this.state.template.diagram)}
                  </a>
                </FormControl.Static>
              </FormGroup>}
            <FormGroup controlId="diagram">
              {!this.state.template.diagram &&
                <ControlLabel>Diagram</ControlLabel>}
              <FormControl onChange={this.handleFileChange} type="file" />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}
