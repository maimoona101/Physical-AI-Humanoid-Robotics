declare module "@theme/Layout";
declare module "@docusaurus/Link";

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
