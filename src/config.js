export default {
  MAX_ATTACHMENT_SIZE: 50000000,
  s3: {
    REGION: "us-east-1",
    BUCKET: "cf-templates-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://z47ae1txll.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_a49iqXr4c",
    APP_CLIENT_ID: "3fle1tmasvk63birffdcmgf4bb",
    IDENTITY_POOL_ID: "us-east-1:c9cb3f2c-fb7b-4e4a-961b-5ecbf9cb1166"
  }
};
