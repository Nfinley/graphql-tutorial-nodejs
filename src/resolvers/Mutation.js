const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  // 1
  const password = await bcrypt.hash(args.password, 10);
  // 2
  const user = await context.prisma.createUser({ ...args, password });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user
  };
}

async function login(parent, args, context, info) {
  // 1
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user
  };
}

function post(parent, args, context, info) {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
}

async function vote(parent, args, context, info) {
  // 1
  const userId = getUserId(context);

  // 2
  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  });
  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // 3
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
}

// function updateLink(parent, args) {
//   links.map(item => {
//     if (item.id === args.id) {
//       item.description = args.description || item.description;
//       item.url = args.url || item.url;
//     }
//   })[0];
//   const updatedLink = links.filter(item => item.id === args.id)[0];
//   return updatedLink;
// }

// function deleteLink(parent, args) {
//   function itemToDelete(element) {
//     return element.id === args.id;
//   }
//   let deletedLink = links.filter(item => item.id === args.id)[0];
//   let index = links.findIndex(itemToDelete);
//   links.splice(index);
//   return deletedLink;
// }

module.exports = {
  signup,
  login,
  post,
  vote
};
