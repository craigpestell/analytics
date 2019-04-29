import { EventResolvers } from '../generated/graphqlgen'

export const Event: EventResolvers.Type = {
  ...EventResolvers.defaultResolvers,

  /* author: (parent, args, ctx) => {
    return ctx.data.users.find(user => user.id === parent.authorId)!
  }, */
}
