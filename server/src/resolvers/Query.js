async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
    : {};

  const links = await context.prisma.links({
    where,
    skip: args.skip,
    first: args.first,
    orderBy: args.orderBy
  });
  const count = await context.prisma
    .linksConnection({
      where
    })
    .aggregate()
    .count();

  return {
    links,
    count
  };
}

function info() {
  return `This is the API of a Hackernews Clone`;
}

function link(parent, { id }) {
  return context.prisma.link({ id });
}
function users(parent) {
  context.prisma.users();
}

module.exports = {
  feed,
  info,
  link,
  users
};
