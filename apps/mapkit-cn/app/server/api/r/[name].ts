export default defineEventHandler<Promise<unknown>>(async (event) => {
  const name = getRouterParam(event, 'name');

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing component name',
    });
  }

  try {
    const registry = await import(`~/registry/${name}.json`);
    return registry.default || registry;
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: `Component "${name}" not found`,
    });
  }
});
