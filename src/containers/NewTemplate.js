import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib";
import "./styles/NewTemplate.css";

export default class NewTemplate extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      content: ""
    };
  }

  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    console.log(event.target.files);
    this.file = event.target.files[0];
  }

  handleDiagramChange = event => {
    console.log(event.target.files)
    this.diagram = event.target.files[0];
  }

  handleSubmit = async event => {
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
      const attachment = this.file
        ? await s3Upload(this.file)
        : null;

      const diagram = this.diagram
        ? await s3Upload(this.diagram)
        : null;

      await this.createTemplate({
        diagram,
        attachment,
        content: this.state.content
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createTemplate(template) {
    return API.post("templates", "/templates", {
      body: template
    });
  }

  render() {
    return (
      <div className="NewTemplate">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Template</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <FormGroup controlId="diagram">
            <ControlLabel>Environment Visual</ControlLabel>
            <FormControl onChange={this.handleDiagramChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </div>
    );
  }
}
