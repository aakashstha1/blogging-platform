export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return res.status(400).json({
        message: firstError.message,
        field: firstError.path[0],
      });
    }

    req.body = result.data;
    next();
  };
};
