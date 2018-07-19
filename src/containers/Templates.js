import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel, Image } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
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
      diagramURL: null,
      editTemplateFile: false,
      editDiagramFile: false
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

  handleDiagramChange = event => {
    this.diagram = event.target.files[0];
  }

  saveTemplate(template) {
    return API.put("templates", `/templates/${this.props.match.params.id}`, { body: template });
  }

  handleSubmit = async event => {
    let attachment;
    let diagram;

    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a template smaller than 50MB");
      return;
    } else if (this.diagram && this.diagram.size > config.MAX_ATTACHMENT_SIZE) {
      alert("Please pick a diagram smaller than 50MB");
      return;
    }

    this.setState({ isLoading: true });

    try {
      if (this.file) {
        let a1 = await Storage.vault.remove(this.state.template.attachment);
        attachment = await s3Upload(this.file);
      }
      if (this.diagram) {
        let d1 = await Storage.vault.remove(this.state.template.diagram);
        diagram = await s3Upload(this.diagram);
      }

      await this.saveTemplate({
        content: this.state.content,
        attachment: attachment || this.state.template.attachment,
        diagram: diagram || this.state.template.diagram
      });
      this.props.history.push("/");
    } catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  deleteTemplate() {
    return API.del("templates", `/templates/${this.props.match.params.id}`);
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

    try {
      let a1 = await Storage.vault.remove(this.state.template.attachment);
      let d1 = await Storage.vault.remove(this.state.template.diagram);
      await this.deleteTemplate();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Templates">
        {this.state.template &&
          <form onSubmit={this.handleSubmit}>
            <div className="diagramImage">
              <Image src={this.state.diagramURL} responsive />
            </div>
            <div className="diagramFile">
              {this.state.template.diagram &&
                <FormGroup>
                  <ControlLabel className="diagramTitle">Environment Visual</ControlLabel>
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
                      <FormControl onChange={this.handleDiagramChange} type="file" />
                    </FormGroup>
            </div>
          <div className="secondRow">
            <div className="attachment">
              {this.state.template.attachment &&
                <FormGroup>
                  <ControlLabel id="templateLabel">Template</ControlLabel>
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
                <FormGroup className="fileInput" controlId="file">
                  {!this.state.template.attachment &&
                    <ControlLabel>Template</ControlLabel>}
                      <FormControl onChange={this.handleFileChange} type="file" />
                </FormGroup>
            </div>
            <div className="note">
              <FormGroup controlId="content">
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.content}
                  componentClass="textarea"
                  />
              </FormGroup>
            </div>
          </div>
          <div className="optionButtons">
            <LoaderButton
              block
              bsStyle="success"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
              />
            <LoaderButton
              block
              bsStyle="danger"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
              />
          </div>
          </form>}
      </div>
    );
  }
}
