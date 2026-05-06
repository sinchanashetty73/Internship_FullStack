const graphql = require("graphql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID
} = graphql;

// USER TYPE
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString }
  })
});


// ROOT QUERY
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {

    users: {
      type: new GraphQLList(UserType),
      async resolve() {
        return await User.find();
      }
    }

  }
});


// MUTATIONS
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {

    // SIGNUP
    signup: {
      type: UserType,

      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },

      async resolve(parent, args) {

        const hashedPassword =
          await bcrypt.hash(args.password, 10);

        const user = new User({
          name: args.name,
          email: args.email,
          password: hashedPassword
        });

        return await user.save();
      }
    },


    // LOGIN
    login: {
      type: GraphQLString,

      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },

      async resolve(parent, args) {

        const user =
          await User.findOne({ email: args.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch =
          await bcrypt.compare(args.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          {
            id: user.id,
            role: user.role
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return token;
      }
    },


    // ADD USER
    addUser: {
      type: UserType,

      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString }
      },

      async resolve(parent, args) {

        const user = new User({
          name: args.name,
          email: args.email
        });

        return await user.save();
      }
    },
    deleteUser: {
      type: UserType,

      args: {
        id: { type: GraphQLID }
      },

      async resolve(parent, args) {

        return await User.findByIdAndDelete(args.id);

      }
    },
    // UPDATE USER
updateUser: {
  type: UserType,

  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  },

  async resolve(parent, args) {

    return await User.findByIdAndUpdate(
      args.id,
      {
        name: args.name,
        email: args.email
      },
      { new: true }
    );

  }
}

  }
});



module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});