declare module "jsbarcode" {
  const JsBarcode: (element: SVGElement | HTMLElement | string, text: string, options?: Record<string, unknown>) => void;
  export default JsBarcode;
}
