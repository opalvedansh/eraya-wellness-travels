import { RequestHandler } from "express";

// Inline type definition (originally from @shared/api)
type DemoResponse = {
  message: string;
};

export const handleDemo: RequestHandler = (req, res) => {
  const response: DemoResponse = {
    message: "Hello from Express server",
  };
  res.status(200).json(response);
};
