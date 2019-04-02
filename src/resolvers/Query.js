function feed(parent, args, context, info) {
  return context.prisma.links();
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
