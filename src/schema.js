/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  introspectionFromSchema,
} from 'graphql';

const fruits = [
  { id: 1, name: 'apple', },
  { id: 2, name: 'mango', },
  { id: 3, name: 'banana', }
]

const FruitType = new GraphQLObjectType({
  name: 'Fruit',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});


const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    fruits: {
      type: new GraphQLList(FruitType), resolve: (parent, args, ctx, info) => {
        if (info?.path?.prev?.prev?.key == "people")
          return [fruits[2]]
        else
          return fruits
      }
    }
  },
});



const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
    user: {
      type: PersonType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return peopleData.find((value) => { return 2 == value.id })
      }
    },
  }
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name,
        };

        peopleData.push(person);
        return person;
      }
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });
