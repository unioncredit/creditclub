export const objectToWhere = (where?: { [key: string]: string }) => {
  return where
    ? `where: { ${Object.keys(where)
      .map((key) => `${key}: "${where[key]}"`)
      .join(",")} }`
    : "";
}